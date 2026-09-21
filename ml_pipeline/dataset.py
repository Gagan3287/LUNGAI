"""
dataset.py — NIH ChestX-ray14 Multi-Label Dataset Loader
==========================================================

Implements a PyTorch Dataset for NIH ChestX-ray14.
Source: https://nihcc.app.box.com/v/ChestXray-NIHCC

REAL USAGE (not run in this session due to no dataset/GPU):
  - Download the NIH dataset (112,120 frontal-view X-ray PNGs + Data_Entry_2017.csv)
  - Point DATA_ROOT at the extracted directory
  - Run train.py which calls build_dataloaders()

THIS SESSION:
  - DummyChestXrayDataset generates random tensors so train.py can execute
    without crashing. No real learning happens.

Dataset Citation:
  Wang et al., "ChestX-ray8: Hospital-scale Chest X-ray Database and Benchmarks"
  CVPR 2017. https://arxiv.org/abs/1705.02315
"""

import os
import json
from pathlib import Path
from typing import List, Tuple, Optional, Dict

import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
import torchvision.transforms as T

# ------------------------------------------------------------------
#  NIH ChestX-ray14 — 14 Disease Label Definitions
# ------------------------------------------------------------------
NIH_CLASSES: List[str] = [
    "Atelectasis",
    "Cardiomegaly",
    "Effusion",
    "Infiltration",
    "Mass",
    "Nodule",
    "Pneumonia",
    "Pneumothorax",
    "Consolidation",
    "Edema",
    "Emphysema",
    "Fibrosis",
    "Pleural_Thickening",
    "Hernia",
]
NUM_CLASSES = len(NIH_CLASSES)

# Disease index for quick lookup
CLASS_TO_IDX: Dict[str, int] = {c: i for i, c in enumerate(NIH_CLASSES)}


# ------------------------------------------------------------------
#  Image Transforms
# ------------------------------------------------------------------
def get_train_transforms(image_size: int = 224) -> T.Compose:
    """
    Train augmentations for chest X-ray classification.
    Resize((224,224)) -> RandomHorizontalFlip(0.5) -> RandomRotation(10) -> ToTensor -> Normalize
    """
    return T.Compose([
        T.Resize((image_size, image_size)),
        T.RandomHorizontalFlip(p=0.5),
        T.RandomRotation(degrees=10),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]),
    ])


def get_val_transforms(image_size: int = 224) -> T.Compose:
    """
    Deterministic pipeline for validation / inference.
    Resize((224,224)) -> ToTensor -> Normalize
    """
    return T.Compose([
        T.Resize((image_size, image_size)),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406],
                    std=[0.229, 0.224, 0.225]),
    ])


# ------------------------------------------------------------------
#  Real NIH ChestX-ray14 Dataset (requires local dataset download)
# ------------------------------------------------------------------
class ChestXrayNIHDataset(Dataset):
    """
    Multi-label chest X-ray classification dataset.

    Expected directory layout (after downloading NIH ChestX-ray14):
        DATA_ROOT/
            images_001/images/*.png ... images_012/images/*.png (or images/*.png)
            Data_Entry_2017.csv

    Parameters
    ----------
    data_root : str
        Path to the root NIH dataset directory.
    split : str
        One of "train", "val", "test". GroupShuffleSplit by Patient ID
        (30% test, then 2/3 train, 1/3 val on remainder).
    transforms : T.Compose, optional
        torchvision transform pipeline.
    """

    def __init__(
        self,
        data_root: str,
        split: str = "train",
        transforms: Optional[T.Compose] = None,
        val_fraction: float = 0.2,
    ):
        super().__init__()
        self.data_root = Path(data_root)
        self.transforms = transforms
        self.split = split

        # Parse CSV label file
        csv_path = self.data_root / "Data_Entry_2017.csv"
        if not csv_path.exists():
            raise FileNotFoundError(
                f"NIH ChestX-ray14 CSV not found at {csv_path}.\n"
                "Download from: https://nihcc.app.box.com/v/ChestXray-NIHCC"
            )

        import pandas as pd
        from sklearn.model_selection import GroupShuffleSplit

        df = pd.read_csv(csv_path)

        # Multi-folder search for images_*/images/*.png as well as images/*.png
        image_map: Dict[str, Path] = {}
        for p in self.data_root.glob("images_*/images/*.png"):
            image_map[p.name] = p
        if not image_map and (self.data_root / "images").exists():
            for p in (self.data_root / "images").glob("*.png"):
                image_map[p.name] = p
        if not image_map:
            for p in self.data_root.rglob("*.png"):
                image_map[p.name] = p

        # GroupShuffleSplit by Patient ID: test 30%, train/val 70% (split 2/3 train, 1/3 val)
        gss_test = GroupShuffleSplit(n_splits=1, test_size=0.30, random_state=42)
        train_val_idx, test_idx = next(gss_test.split(df, groups=df["Patient ID"]))

        if split == "test":
            split_df = df.iloc[test_idx]
        else:
            train_val_df = df.iloc[train_val_idx].reset_index(drop=True)
            gss_val = GroupShuffleSplit(n_splits=1, test_size=1/3, random_state=42)
            train_sub_idx, val_idx = next(gss_val.split(train_val_df, groups=train_val_df["Patient ID"]))
            if split == "train":
                split_df = train_val_df.iloc[train_sub_idx]
            elif split == "val":
                split_df = train_val_df.iloc[val_idx]
            else:
                raise ValueError(f"Unknown split '{split}'")

        self.samples: List[Tuple[Path, List[float]]] = []
        for _, row in split_df.iterrows():
            fname = row["Image Index"]
            conditions = str(row["Finding Labels"]).split("|")
            vec = [1.0 if cls in conditions else 0.0 for cls in NIH_CLASSES]
            img_path = image_map.get(fname, self.data_root / "images" / fname)
            if img_path.exists():
                self.samples.append((img_path, vec))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx: int):
        from PIL import Image
        img_path, label_vec = self.samples[idx]
        image = Image.open(img_path).convert("RGB")
        if self.transforms:
            image = self.transforms(image)
        label_tensor = torch.tensor(label_vec, dtype=torch.float32)
        return image, label_tensor

    def compute_pos_weights(self) -> torch.Tensor:
        """
        Computes positive class weights for BCEWithLogitsLoss:
            pos_weight[c] = (num_negative[c] / num_positive[c])

        # REVIEW: Class imbalance strategy confirmed here — pos_weight drives
        # BCEWithLogitsLoss to penalise false negatives harder for rare classes
        # (e.g. Hernia <0.2% prevalence). This is the NIH ChestX-ray14 standard
        # approach. Confirm this is the strategy you want before training starts.
        #
        # Alternative strategies (not implemented here) that need your decision:
        #   A) Focal Loss (gamma=2) — better for extreme imbalance but harder to tune
        #   B) Oversampling abnormal cases via WeightedRandomSampler (see below)
        #   C) No imbalance correction (likely underfit on rare diseases)
        """
        if not self.samples:
            return torch.ones(NUM_CLASSES)

        labels = torch.stack([torch.tensor(s[1]) for s in self.samples])
        pos_count = labels.sum(0).clamp(min=1)
        neg_count = (len(self.samples) - labels.sum(0)).clamp(min=1)
        return neg_count / pos_count


# ------------------------------------------------------------------
#  WeightedRandomSampler for multi-label imbalance (optional)
# ------------------------------------------------------------------
def build_weighted_sampler(dataset: ChestXrayNIHDataset) -> WeightedRandomSampler:
    """
    Builds a per-image sampling weight such that images with rare pathologies
    are sampled more frequently.

    # REVIEW: This sampler is OPTIONAL and works alongside pos_weight in the
    # loss function. Using BOTH simultaneously (loss weighting + oversampling)
    # can over-correct — confirm whether you want sampler OR pos_weight, not both.
    """
    labels = torch.stack([torch.tensor(s[1]) for s in dataset.samples])
    # Weight each image by the rarity of its rarest positive class
    class_freq = labels.mean(0).clamp(min=1e-6)
    per_class_weight = 1.0 / class_freq
    # Each image's weight = max weight among its positive classes
    sample_weights = (labels * per_class_weight.unsqueeze(0)).max(dim=1).values
    # Normal images (all-zero label) get weight = 1.0
    sample_weights = torch.where(sample_weights == 0, torch.ones_like(sample_weights), sample_weights)
    return WeightedRandomSampler(
        weights=sample_weights.tolist(),
        num_samples=len(sample_weights),
        replacement=True
    )


# ------------------------------------------------------------------
#  DataLoader Factory
# ------------------------------------------------------------------
def build_dataloaders(
    data_root: str,
    batch_size: int = 32,
    num_workers: int = 4,
    image_size: int = 224,
    use_weighted_sampler: bool = False,
) -> Tuple[DataLoader, DataLoader, DataLoader]:
    """
    Returns (train_loader, val_loader, test_loader) for NIH ChestX-ray14.

    Parameters
    ----------
    data_root : str
        Path to the root NIH dataset directory.
    batch_size : int
        Batch size for training (default 32 fits in 16 GB VRAM with ResNet50).
    num_workers : int
        DataLoader worker threads. Set to 0 on Windows if you encounter errors.
    image_size : int
        Input resolution (224 for ResNet50/EfficientNet-B0).
    use_weighted_sampler : bool
        Whether to apply WeightedRandomSampler on the training loader.
        See REVIEW comment in build_weighted_sampler() above.
    """
    train_ds = ChestXrayNIHDataset(data_root, split="train", transforms=get_train_transforms(image_size))
    val_ds   = ChestXrayNIHDataset(data_root, split="val",   transforms=get_val_transforms(image_size))
    test_ds  = ChestXrayNIHDataset(data_root, split="test",  transforms=get_val_transforms(image_size))

    train_sampler = build_weighted_sampler(train_ds) if use_weighted_sampler else None

    train_loader = DataLoader(
        train_ds,
        batch_size=batch_size,
        shuffle=(train_sampler is None),
        sampler=train_sampler,
        num_workers=num_workers,
        pin_memory=True,
    )
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=True)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers, pin_memory=True)
    return train_loader, val_loader, test_loader


# ------------------------------------------------------------------
#  Dummy Dataset — used in this session for smoke-testing ONLY
# ------------------------------------------------------------------
class DummyChestXrayDataset(Dataset):
    """
    Generates synthetic random tensors shaped identically to real data.
    Used to confirm train.py runs without crashing in CPU-only / no-dataset envs.
    NOT suitable for learning — random labels produce random predictions.
    """
    def __init__(self, num_samples: int = 64, image_size: int = 224):
        self.num_samples = num_samples
        self.image_size = image_size
        # Simulate realistic positive label sparsity (~10% positives per class)
        self.labels = (torch.rand(num_samples, NUM_CLASSES) > 0.9).float()

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx: int):
        image = torch.randn(3, self.image_size, self.image_size)
        label = self.labels[idx]
        return image, label

    def compute_pos_weights(self) -> torch.Tensor:
        pos_count = self.labels.sum(0).clamp(min=1)
        neg_count = (self.num_samples - self.labels.sum(0)).clamp(min=1)
        return neg_count / pos_count
