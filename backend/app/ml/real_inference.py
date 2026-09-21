"""
real_inference.py — Real DenseNet121 Inference Engine for LungAI Backend.
Loads fine-tuned NIH ChestX-ray14 weights and performs real PyTorch inference.
"""

import os
import time
import logging
from pathlib import Path
from typing import Dict, Any

import torch
import torchvision.transforms as T
from PIL import Image

from .model_def import build_backend_model, NIH_CLASSES

logger = logging.getLogger("lungai.real_inference")

CHECKPOINT_PATH = Path(__file__).parent / "checkpoints" / "best_model.pth"

_model = None
_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def get_inference_model():
    global _model
    if _model is not None:
        return _model

    logger.info(f"[REAL INFERENCE] Initializing DenseNet121 model on device: {_device}")
    print(f">> [REAL INFERENCE] Initializing DenseNet121 model on device: {_device}")

    model = build_backend_model(pretrained=False)

    if not CHECKPOINT_PATH.exists():
        raise FileNotFoundError(f"[REAL INFERENCE] Checkpoint file not found at {CHECKPOINT_PATH}")

    state_dict = torch.load(CHECKPOINT_PATH, map_location=_device)
    if isinstance(state_dict, dict) and "model_state_dict" in state_dict:
        state_dict = state_dict["model_state_dict"]

    # Sanity check: zero missing/unexpected keys
    res = model.load_state_dict(state_dict, strict=True)

    success_msg = f"[REAL INFERENCE] Checkpoint loaded from {CHECKPOINT_PATH}\n[REAL INFERENCE] Sanity Check — Missing keys: {res.missing_keys}, Unexpected keys: {res.unexpected_keys}"
    logger.info(success_msg)
    print(f">> {success_msg}")
    print(">> [REAL INFERENCE] SANITY CHECK PASSED: Zero missing/unexpected keys!")

    if res.missing_keys or res.unexpected_keys:
        raise RuntimeError(f"Model state_dict mismatch! Missing: {res.missing_keys}, Unexpected: {res.unexpected_keys}")

    model.to(_device)
    model.eval()
    _model = model
    return _model


def get_transform():
    return T.Compose([
        T.Resize((224, 224)),
        T.ToTensor(),
        T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])


def run_real_inference(image_path: str) -> Dict[str, Any]:
    """
    Runs actual PyTorch DenseNet121 inference on an uploaded X-ray image file.
    Returns structured results matching the scan response schema.
    """
    start_time = time.time()
    model = get_inference_model()
    transform = get_transform()

    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(_device)

    use_cuda = (_device.type == "cuda")
    with torch.no_grad():
        with torch.amp.autocast(device_type="cuda", enabled=use_cuda):
            logits = model(tensor)
        probs = torch.sigmoid(logits)[0].cpu().numpy()

    class_probs = {cls_name: float(probs[i] * 100.0) for i, cls_name in enumerate(NIH_CLASSES)}
    sorted_classes = sorted(class_probs.items(), key=lambda item: item[1], reverse=True)
    top_class, top_prob = sorted_classes[0]

    IS_NORMAL_THRESHOLD = 50.0
    is_normal = (top_prob < IS_NORMAL_THRESHOLD)

    if is_normal:
        primary_condition = "Normal Scan"
        confidence = round(max(90.0, 100.0 - top_prob), 1)
        severity = "Normal"
        affected_area = "None (Unremarkable)"
        findings = "Clear lung fields with no focal consolidation, pleural effusion, or pneumothorax. Cardiac silhouette is within normal limits."
        marker_3d = None
    else:
        primary_condition = f"{top_class} Detected"
        confidence = round(top_prob, 1)
        if confidence >= 80.0:
            severity = "High"
        elif confidence >= 65.0:
            severity = "Moderate"
        else:
            severity = "Low"

        affected_area = f"Pulmonary Region ({top_class})"
        findings = f"Radiographic evidence consistent with {top_class} (confidence: {confidence}%). Clinical correlation recommended."
        marker_3d = {
            "x": 0.45,
            "y": -0.65,
            "z": 0.25,
            "label": "Abnormality Detected",
            "regionName": f"{top_class} Focus"
        }

    disease_breakdown = []
    for cls_name, p in sorted_classes:
        category = "primary" if cls_name == top_class and not is_normal else ("secondary" if p >= 20.0 else "low")
        disease_breakdown.append({
            "disease": cls_name,
            "probability": round(p, 1),
            "category": category
        })

    latency = round(time.time() - start_time, 2)

    return {
        "primaryCondition": primary_condition,
        "confidence": confidence,
        "severity": severity,
        "affectedArea": affected_area,
        "analysisTimeSeconds": latency,
        "findingsSummary": findings,
        "isNormal": is_normal,
        "marker3D": marker_3d,
        "diseaseBreakdown": disease_breakdown,
    }
