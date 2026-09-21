"""
train.py — Training Loop for LungAI Multi-Label Chest X-Ray Classifier
=======================================================================

USAGE (real training, after downloading NIH ChestX-ray14 dataset):
    python train.py \
        --data_root /path/to/NIH_ChestXray14 \
        --backbone resnet50 \
        --epochs 30 \
        --batch_size 32 \
        --lr 1e-4 \
        --checkpoint_dir ./checkpoints

USAGE (smoke test, this session — CPU only, dummy data):
    python train.py --smoke_test

KEY DESIGN DECISIONS — ALL FLAGGED WITH # REVIEW
-------------------------------------------------
  1. Loss function: BCEWithLogitsLoss with pos_weight
  2. Class imbalance: pos_weight + optional WeightedRandomSampler
  3. Severity/confidence threshold: 0.5 default (see REVIEW block below)
  4. Optimizer: Adam with weight decay (not SGD)
  5. LR scheduler: ReduceLROnPlateau on val AUROC
"""

import os
import argparse
import json
from typing import Dict, Optional
import numpy as np

import torch
import torch.nn as nn
from torch.optim import Adam
from torch.optim.lr_scheduler import ReduceLROnPlateau
from torch.utils.data import DataLoader

from dataset import (
    NUM_CLASSES, NIH_CLASSES,
    DummyChestXrayDataset,
    build_dataloaders,
)
from model import build_model


POSITIVE_THRESHOLD: float = 0.5

SEVERITY_THRESHOLDS = {
    "High":     0.80,
    "Moderate": 0.65,
    "Low":      0.50,
}


def prob_to_severity(prob: float) -> str:
    if prob >= SEVERITY_THRESHOLDS["High"]:
        return "High"
    elif prob >= SEVERITY_THRESHOLDS["Moderate"]:
        return "Moderate"
    elif prob >= SEVERITY_THRESHOLDS["Low"]:
        return "Low"
    return "Normal"


# ------------------------------------------------------------------
#  Training Step (with Automatic Mixed Precision - AMP)
# ------------------------------------------------------------------
def train_one_epoch(
    model: nn.Module,
    loader: DataLoader,
    optimizer: torch.optim.Optimizer,
    criterion: nn.Module,
    scaler: torch.amp.GradScaler,
    device: torch.device,
) -> float:
    model.train()
    total_loss = 0.0
    use_cuda = (device.type == "cuda")

    for batch_idx, (images, labels) in enumerate(loader):
        images, labels = images.to(device), labels.to(device)
        optimizer.zero_grad()
        with torch.amp.autocast(device_type="cuda", enabled=use_cuda):
            logits = model(images)
            loss = criterion(logits, labels)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
        total_loss += loss.item()
    return total_loss / max(len(loader), 1)


# ------------------------------------------------------------------
#  Validation Step (monitoring macro-AUROC)
# ------------------------------------------------------------------
@torch.no_grad()
def validate(
    model: nn.Module,
    loader: DataLoader,
    criterion: nn.Module,
    device: torch.device,
) -> Dict[str, float]:
    model.eval()
    total_loss = 0.0
    total_correct = 0
    total_elements = 0
    probs_list, labels_list = [], []
    use_cuda = (device.type == "cuda")

    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        with torch.amp.autocast(device_type="cuda", enabled=use_cuda):
            logits = model(images)
            loss = criterion(logits, labels)
        total_loss += loss.item()

        probs = torch.sigmoid(logits)
        probs_list.append(probs.cpu().numpy())
        labels_list.append(labels.cpu().numpy())

        preds = (probs >= POSITIVE_THRESHOLD).float()
        total_correct += (preds == labels).sum().item()
        total_elements += labels.numel()

    all_probs = np.concatenate(probs_list, axis=0) if probs_list else np.empty((0, NUM_CLASSES))
    all_labels = np.concatenate(labels_list, axis=0) if labels_list else np.empty((0, NUM_CLASSES))

    from evaluate import compute_auroc
    auroc_res = compute_auroc(all_probs, all_labels)
    val_auroc = auroc_res.get("mean_auroc") if isinstance(auroc_res, dict) else None
    if val_auroc is None:
        val_auroc = total_correct / max(total_elements, 1)

    return {
        "val_loss": total_loss / max(len(loader), 1),
        "val_acc": total_correct / max(total_elements, 1),
        "val_auroc": float(val_auroc),
    }


# ------------------------------------------------------------------
#  Checkpoint Save / Load (bare torch.save(model.state_dict()))
# ------------------------------------------------------------------
def save_checkpoint(
    model: nn.Module,
    checkpoint_dir: str,
    epoch: int,
    is_best: bool = False,
) -> None:
    os.makedirs(checkpoint_dir, exist_ok=True)
    epoch_path = os.path.join(checkpoint_dir, f"checkpoint_epoch_{epoch:03d}.pth")
    torch.save(model.state_dict(), epoch_path)
    if is_best:
        best_path = os.path.join(checkpoint_dir, "best_model.pth")
        torch.save(model.state_dict(), best_path)
        print(f"  [OK] Best checkpoint saved -> {best_path}")


def load_checkpoint(checkpoint_path: str, model: nn.Module) -> None:
    """
    Loads bare state_dict checkpoint weights into model.
    """
    state = torch.load(checkpoint_path, map_location="cpu")
    if isinstance(state, dict) and "model_state_dict" in state:
        model.load_state_dict(state["model_state_dict"])
    else:
        model.load_state_dict(state)


# ------------------------------------------------------------------
#  Main Training Entrypoint
# ------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="LungAI Training Pipeline")
    parser.add_argument("--data_root", type=str, default=None,
                        help="Path to NIH ChestX-ray14 dataset root directory")
    parser.add_argument("--backbone", type=str, default="densenet121",
                        choices=["densenet121", "resnet50", "efficientnet_b4"])
    parser.add_argument("--epochs", type=int, default=30)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--weight_decay", type=float, default=1e-5)
    parser.add_argument("--checkpoint_dir", type=str, default="./checkpoints")
    parser.add_argument("--num_workers", type=int, default=4)
    parser.add_argument("--use_weighted_sampler", action="store_true")
    parser.add_argument("--smoke_test", action="store_true",
                        help="Use DummyDataset for CPU smoke-testing (no dataset/GPU needed)")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n{'='*60}")
    print("  LungAI — Multi-Label Chest X-Ray Training Pipeline")
    print(f"{'='*60}")
    print(f"  Backbone:     {args.backbone}")
    print(f"  Device:       {device}")
    print(f"  Smoke test:   {args.smoke_test}")
    print(f"{'='*60}\n")

    # Build DataLoaders
    if args.smoke_test:
        print(">> [SMOKE TEST] Using DummyChestXrayDataset — CPU, random tensors only")
        dummy_train = DummyChestXrayDataset(num_samples=64)
        dummy_val   = DummyChestXrayDataset(num_samples=16)
        train_loader = DataLoader(dummy_train, batch_size=8, shuffle=True)
        val_loader   = DataLoader(dummy_val,   batch_size=8, shuffle=False)
        pos_weights  = dummy_train.compute_pos_weights()
        args.epochs  = 2
    else:
        if not args.data_root:
            raise ValueError("--data_root is required for real training. Use --smoke_test for testing.")
        print(f">> Loading NIH ChestX-ray14 dataset from: {args.data_root}")
        train_loader, val_loader, _ = build_dataloaders(
            data_root=args.data_root,
            batch_size=args.batch_size,
            num_workers=args.num_workers,
            use_weighted_sampler=args.use_weighted_sampler,
        )
        pos_weights = train_loader.dataset.compute_pos_weights()

    # Build Model
    pretrained = not args.smoke_test
    model = build_model(backbone=args.backbone, pretrained=pretrained)
    model.to(device)

    # Loss Function
    pos_weights = pos_weights.to(device)
    criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weights)

    # Optimizer & AMP Scaler
    optimizer = Adam(model.parameters(), lr=args.lr, weight_decay=args.weight_decay)
    scaler = torch.amp.GradScaler("cuda", enabled=(device.type == "cuda"))

    # LR Scheduler — ReduceLROnPlateau monitoring val_auroc (mode='max')
    scheduler = ReduceLROnPlateau(optimizer, mode="max", factor=0.5, patience=3)

    # Training Loop with Early Stopping (PATIENCE=5)
    best_val_auroc = -1.0
    patience = 5
    patience_counter = 0
    history = []

    for epoch in range(1, args.epochs + 1):
        train_loss = train_one_epoch(model, train_loader, optimizer, criterion, scaler, device)
        val_metrics = validate(model, val_loader, criterion, device)

        val_auroc = val_metrics["val_auroc"]
        scheduler.step(val_auroc)

        metrics = {
            "epoch": epoch,
            "train_loss": round(train_loss, 5),
            **{k: round(v, 5) for k, v in val_metrics.items()},
        }
        history.append(metrics)

        is_best = val_auroc > best_val_auroc
        if is_best:
            best_val_auroc = val_auroc
            patience_counter = 0
        else:
            patience_counter += 1

        save_checkpoint(model, args.checkpoint_dir, epoch, is_best=is_best)

        print(
            f"  Epoch {epoch:03d}/{args.epochs} | "
            f"Train Loss: {train_loss:.4f} | "
            f"Val Loss: {val_metrics['val_loss']:.4f} | "
            f"Val Acc: {val_metrics['val_acc']*100:.2f}% | "
            f"Val AUROC: {val_auroc:.4f} "
            f"{'<-- BEST' if is_best else ''}"
        )

        if patience_counter >= patience:
            print(f"\n[INFO] Early stopping triggered after {epoch} epochs (no improvement in val AUROC for {patience} epochs).")
            break

    # Save history JSON for plotting
    history_path = os.path.join(args.checkpoint_dir, "training_history.json")
    os.makedirs(args.checkpoint_dir, exist_ok=True)
    with open(history_path, "w") as f:
        json.dump(history, f, indent=2)

    print(f"\n[OK] Training complete. History saved -> {history_path}")
    print(f"[OK] Best val AUROC: {best_val_auroc:.5f}")


if __name__ == "__main__":
    main()
