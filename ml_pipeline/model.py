"""
model.py — Multi-Label Chest X-Ray Classification Backbone
============================================================

Implements two interchangeable transfer-learning backbones:
  1. ResNet50        — standard NIH ChestX-ray14 baseline (Wang et al. 2017)
  2. EfficientNet-B4 — stronger accuracy / efficiency tradeoff (Touvron 2021)

Both are pretrained on ImageNet and fine-tuned on NIH ChestX-ray14.
The final layer is replaced with a linear head outputting NUM_CLASSES=14 logits
(raw; sigmoid is applied externally in the loss and inference layers).

ARCHITECTURE DECISION LOG
--------------------------
  - Output = 14 raw logits (no sigmoid). Sigmoid is applied in:
      * Loss:      BCEWithLogitsLoss (numerically stable)
      * Inference: torch.sigmoid(logits) then threshold comparison
  - Global Average Pooling (GAP) is used for spatial aggregation, which is
    compatible with Grad-CAM feature map extraction from the last conv block.
"""

import torch
import torch.nn as nn
import torchvision.models as tvm
from dataset import NUM_CLASSES


# ------------------------------------------------------------------
#  Model Factory
# ------------------------------------------------------------------
def build_model(
    backbone: str = "densenet121",
    num_classes: int = NUM_CLASSES,
    pretrained: bool = True,
    dropout_rate: float = 0.5,
) -> nn.Module:
    """
    Builds the classification model.

    Parameters
    ----------
    backbone : str
        One of "densenet121" | "resnet50" | "efficientnet_b4"
    num_classes : int
        Number of output disease classes (14 for NIH ChestX-ray14).
    pretrained : bool
        Load ImageNet pretrained weights (requires internet on first run).
    dropout_rate : float
        Dropout before the classification head (used for resnet50 and efficientnet_b4).

    Returns
    -------
    nn.Module
        Model with replaced classification head.
    """
    if backbone == "densenet121":
        weights = tvm.DenseNet121_Weights.IMAGENET1K_V1 if pretrained else None
        model = tvm.densenet121(weights=weights)
        in_features = model.classifier.in_features  # 1024
        model.classifier = nn.Linear(in_features, num_classes)
    elif backbone == "resnet50":
        weights = tvm.ResNet50_Weights.IMAGENET1K_V1 if pretrained else None
        model = tvm.resnet50(weights=weights)
        in_features = model.fc.in_features  # 2048
        model.fc = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(in_features, num_classes),
        )
    elif backbone == "efficientnet_b4":
        weights = tvm.EfficientNet_B4_Weights.IMAGENET1K_V1 if pretrained else None
        model = tvm.efficientnet_b4(weights=weights)
        in_features = model.classifier[1].in_features  # 1792
        model.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(in_features, num_classes),
        )
    else:
        raise ValueError(f"Unknown backbone '{backbone}'. Choose 'densenet121', 'resnet50' or 'efficientnet_b4'.")
    return model


def freeze_backbone(model: nn.Module, backbone: str) -> None:
    """
    Freezes all layers except the final classification head.
    Useful for Stage-1 fine-tuning when dataset is small.
    """
    # Freeze everything first
    for param in model.parameters():
        param.requires_grad = False

    # Unfreeze head only
    if backbone == "resnet50":
        for param in model.fc.parameters():
            param.requires_grad = True
    elif backbone in ("efficientnet_b4", "densenet121"):
        for param in model.classifier.parameters():
            param.requires_grad = True


def unfreeze_all(model: nn.Module) -> None:
    """Re-enables gradients on all model parameters (Stage 2 fine-tuning)."""
    for param in model.parameters():
        param.requires_grad = True


# ------------------------------------------------------------------
#  Grad-CAM Hook: Register Forward/Backward Handles
# ------------------------------------------------------------------
def get_gradcam_target_layer(model: nn.Module, backbone: str) -> nn.Module:
    """
    Returns the last convolutional layer to attach Grad-CAM hooks to.

    For DenseNet121:    model.features.denseblock4
    For ResNet50:       model.layer4[-1]
    For EfficientNet:   model.features[-1][0]
    """
    if backbone == "densenet121":
        return model.features.denseblock4
    elif backbone == "resnet50":
        return model.layer4[-1]
    elif backbone == "efficientnet_b4":
        return model.features[-1][0]
    else:
        raise ValueError(f"Unknown backbone '{backbone}'")
