"""
evaluate.py — AUROC and Per-Class Metrics for NIH ChestX-ray14
================================================================

Computes the standard evaluation metrics used in the NIH ChestX-ray14 benchmark:
  - Per-class AUROC (Area Under ROC Curve), one per disease class
  - Macro-average AUROC across all 14 classes
  - Per-class precision, recall, F1 at a fixed threshold (default 0.5)
  - Confusion-matrix–derived statistics

Wang et al. 2017 baseline target: mean AUROC ~0.745 across 14 classes.
State-of-the-art (2023–2024): ~0.83 mean AUROC (CheXpert, EfficientNet-B4).

USAGE
-----
Real evaluation (after training):
    python evaluate.py \
        --checkpoint ./checkpoints/best_model.pth \
        --data_root /path/to/NIH_ChestXray14 \
        --split test

Smoke test (CPU, no dataset):
    python evaluate.py --smoke_test

OUTPUT
------
Prints per-class AUROC table and saves results as evaluate_results.json
in the checkpoint directory.
"""

import os
import json
import argparse
from typing import Dict, List

import numpy as np
import torch
from torch.utils.data import DataLoader

from dataset import NUM_CLASSES, NIH_CLASSES, DummyChestXrayDataset

try:
    from sklearn.metrics import roc_auc_score, precision_score, recall_score, f1_score
    HAS_SKLEARN = True
except ImportError:
    print("WARNING: scikit-learn not installed. AUROC will be skipped.")
    HAS_SKLEARN = False


# ------------------------------------------------------------------
#  Inference Pass — collect all predictions + ground truth
# ------------------------------------------------------------------
@torch.no_grad()
def collect_predictions(
    model: torch.nn.Module,
    loader: DataLoader,
    device: torch.device,
) -> tuple:
    """
    Runs inference over the full loader with Automatic Mixed Precision (AMP).

    Returns
    -------
    all_probs : np.ndarray  shape (N, 14) — sigmoid probabilities
    all_labels : np.ndarray shape (N, 14) — binary ground-truth labels
    """
    model.eval()
    probs_list, labels_list = [], []
    use_cuda = (device.type == "cuda")

    for images, labels in loader:
        images = images.to(device)
        with torch.amp.autocast(device_type="cuda", enabled=use_cuda):
            logits = model(images)
        probs = torch.sigmoid(logits).cpu().numpy()
        probs_list.append(probs)
        labels_list.append(labels.numpy())

    all_probs  = np.concatenate(probs_list,  axis=0)   # (N, 14)
    all_labels = np.concatenate(labels_list, axis=0)   # (N, 14)
    return all_probs, all_labels


# ------------------------------------------------------------------
#  Per-Class AUROC
# ------------------------------------------------------------------
def compute_auroc(all_probs: np.ndarray, all_labels: np.ndarray) -> Dict[str, float]:
    """
    Computes per-class AUROC for each of the 14 NIH disease classes.

    Skips classes where all ground-truth labels are 0 or all are 1
    (AUROC is undefined for such degenerate cases — common in DummyDataset
    and small held-out sets).

    Returns
    -------
    Dict mapping disease class name → AUROC score (float in [0, 1]).
    Also includes "mean_auroc" key.
    """
    if not HAS_SKLEARN:
        return {"error": "scikit-learn not installed"}

    results = {}
    valid_aurocs = []

    for i, cls_name in enumerate(NIH_CLASSES):
        y_true = all_labels[:, i]
        y_score = all_probs[:, i]

        n_pos = y_true.sum()
        n_neg = len(y_true) - n_pos

        if n_pos == 0 or n_neg == 0:
            results[cls_name] = None  # AUROC undefined for this class in this split
            continue

        auroc = roc_auc_score(y_true, y_score)
        results[cls_name] = round(float(auroc), 4)
        valid_aurocs.append(auroc)

    results["mean_auroc"] = round(float(np.mean(valid_aurocs)), 4) if valid_aurocs else None
    return results


# ------------------------------------------------------------------
#  Per-Class Precision, Recall, F1 at Threshold
# ------------------------------------------------------------------
def compute_classification_report(
    all_probs: np.ndarray,
    all_labels: np.ndarray,
    threshold: float = 0.5,
) -> Dict[str, Dict]:
    """
    Computes P/R/F1 at a fixed threshold.

    # REVIEW: threshold=0.5 is the default, but optimal per-class thresholds
    # found on the val set are typically much lower for NIH ChestX-ray14
    # (see train.py REVIEW Block 3). This function should be run at the
    # val-set-optimized threshold once you have real predictions.
    """
    if not HAS_SKLEARN:
        return {"error": "scikit-learn not installed"}

    preds = (all_probs >= threshold).astype(int)
    report = {}

    for i, cls_name in enumerate(NIH_CLASSES):
        y_true = all_labels[:, i]
        y_pred = preds[:, i]

        n_pos = y_true.sum()
        if n_pos == 0:
            report[cls_name] = {"precision": None, "recall": None, "f1": None, "support": 0}
            continue

        p = precision_score(y_true, y_pred, zero_division=0)
        r = recall_score(y_true, y_pred, zero_division=0)
        f = f1_score(y_true, y_pred, zero_division=0)
        report[cls_name] = {
            "precision": round(float(p), 4),
            "recall":    round(float(r), 4),
            "f1":        round(float(f), 4),
            "support":   int(n_pos),
        }

    return report


# ------------------------------------------------------------------
#  Pretty Printer
# ------------------------------------------------------------------
def print_auroc_table(auroc_results: Dict[str, float]) -> None:
    print(f"\n{'-'*50}")
    print(f"  {'Disease Class':<25} {'AUROC':>8}")
    print(f"{'-'*50}")
    for cls_name in NIH_CLASSES:
        v = auroc_results.get(cls_name)
        val_str = f"{v:.4f}" if v is not None else "N/A (no positives)"
        print(f"  {cls_name:<25} {val_str:>8}")
    print(f"{'-'*50}")
    mean_v = auroc_results.get("mean_auroc")
    mean_str = f"{mean_v:.4f}" if mean_v is not None else "N/A"
    print(f"  {'MEAN AUROC':<25} {mean_str:>8}")
    print(f"{'-'*50}\n")


# ------------------------------------------------------------------
#  Main Entrypoint
# ------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="LungAI Evaluation Pipeline")
    parser.add_argument("--checkpoint", type=str, default=None,
                        help="Path to .pth checkpoint file")
    parser.add_argument("--data_root", type=str, default=None,
                        help="NIH ChestX-ray14 dataset root directory")
    parser.add_argument("--backbone", type=str, default="densenet121",
                        choices=["densenet121", "resnet50", "efficientnet_b4"])
    parser.add_argument("--split", type=str, default="test",
                        choices=["val", "test"])
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--threshold", type=float, default=0.5,
                        help="Classification threshold")
    parser.add_argument("--output_dir", type=str, default="./checkpoints")
    parser.add_argument("--smoke_test", action="store_true",
                        help="Evaluate on DummyDataset (no dataset/checkpoint needed)")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\n{'='*60}")
    print("  LungAI — Evaluation Pipeline (NIH ChestX-ray14)")
    print(f"{'='*60}")
    print(f"  Backbone:  {args.backbone}")
    print(f"  Split:     {args.split}")
    print(f"  Threshold: {args.threshold}")
    print(f"  Device:    {device}")
    print(f"  Smoke test:{args.smoke_test}")
    print(f"{'='*60}\n")

    from model import build_model

    if args.smoke_test:
        print(">> [SMOKE TEST] Using DummyChestXrayDataset")
        dummy_ds = DummyChestXrayDataset(num_samples=32)
        loader = DataLoader(dummy_ds, batch_size=8, shuffle=False)
        model = build_model(backbone=args.backbone, pretrained=False)
    else:
        if not args.checkpoint or not args.data_root:
            raise ValueError("Both --checkpoint and --data_root are required for real evaluation.")
        from dataset import build_dataloaders

        model = build_model(backbone=args.backbone, pretrained=False)
        state_dict = torch.load(args.checkpoint, map_location=device)
        if isinstance(state_dict, dict) and "model_state_dict" in state_dict:
            state_dict = state_dict["model_state_dict"]
        model.load_state_dict(state_dict)
        print(f">> Loaded checkpoint: {args.checkpoint} (backbone={args.backbone})")

        _, val_loader, test_loader = build_dataloaders(
            data_root=args.data_root, batch_size=args.batch_size
        )
        loader = test_loader if args.split == "test" else val_loader

    model.to(device)

    print(">> Collecting predictions...")
    all_probs, all_labels = collect_predictions(model, loader, device)
    print(f"   Predictions shape: {all_probs.shape}, Labels shape: {all_labels.shape}")

    # Compute AUROC
    print(">> Computing AUROC...")
    auroc = compute_auroc(all_probs, all_labels)
    print_auroc_table(auroc)

    # Compute P/R/F1
    print(f">> Computing P/R/F1 at threshold={args.threshold}...")
    clf_report = compute_classification_report(all_probs, all_labels, args.threshold)

    # Save results
    results = {
        "split": args.split,
        "threshold": args.threshold,
        "device": str(device),
        "auroc": auroc,
        "classification_report": clf_report,
    }
    os.makedirs(args.output_dir, exist_ok=True)
    out_path = os.path.join(args.output_dir, f"evaluate_{args.split}_results.json")
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"[OK] Evaluation results saved -> {out_path}")

    if auroc.get("mean_auroc"):
        print(f"[OK] Mean AUROC: {auroc['mean_auroc']:.4f}")


if __name__ == "__main__":
    main()
