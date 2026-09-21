"""
model_def.py — Self-contained DenseNet121 model definition for LungAI backend.
No dependency on ml_pipeline package.
"""

import torch
import torch.nn as nn
import torchvision.models as tvm

# 14 NIH ChestX-ray14 Disease Labels
NIH_CLASSES = [
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
    "Pleural Thickening",
    "Hernia",
]

NUM_CLASSES = len(NIH_CLASSES)


def build_backend_model(pretrained: bool = False) -> nn.Module:
    """
    Builds the DenseNet121 model matching the exact training architecture:
      - Backbone: densenet121
      - Head: bare nn.Linear(1024, 14) — NO Dropout wrapper.
    """
    weights = tvm.DenseNet121_Weights.IMAGENET1K_V1 if pretrained else None
    model = tvm.densenet121(weights=weights)
    in_features = model.classifier.in_features  # 1024
    model.classifier = nn.Linear(in_features, NUM_CLASSES)
    return model


def get_gradcam_target_layer(model: nn.Module) -> nn.Module:
    """
    Returns denseblock4 layer for Grad-CAM feature map extraction.
    Note: Unverified against notebook code (treated as best-effort until user confirmation).
    """
    return model.features.denseblock4
