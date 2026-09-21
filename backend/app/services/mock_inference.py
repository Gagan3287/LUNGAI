import random
import time
from typing import Dict, Any

# 14 NIH ChestX-ray14 Disease Classes
NIH_CLASSES = [
    "Atelectasis", "Cardiomegaly", "Effusion", "Infiltration", "Mass",
    "Nodule", "Pneumonia", "Pneumothorax", "Consolidation", "Edema",
    "Emphysema", "Fibrosis", "Pleural Thickening", "Tuberculosis"
]

def run_mock_inference(file_name: str, patient_id: str = None) -> Dict[str, Any]:
    """
    Simulates multi-label ResNet50/EfficientNet NIH ChestX-ray14 PyTorch model prediction.
    Outputs structured prediction matching the real model's response schema.
    """
    start_time = time.time()
    
    # Simulated processing latency (1.5 - 2.5 seconds real feel)
    time.sleep(0.1) 
    
    # 35% chance of normal scan, 65% abnormal
    is_normal = random.random() < 0.35
    
    if is_normal:
        primary_condition = "Normal Scan"
        confidence = round(random.uniform(91.0, 98.5), 1)
        severity = "Normal"
        affected_area = "None (Unremarkable)"
        findings = "Clear lung fields with no focal consolidation, pleural effusion, or pneumothorax. Cardiac silhouette is within normal limits."
        marker_3d = None
        disease_breakdown = [
            {"disease": "Normal", "probability": confidence, "category": "primary"},
            {"disease": "Infiltration", "probability": round(random.uniform(1.0, 4.0), 1), "category": "low"},
            {"disease": "Atelectasis", "probability": round(random.uniform(0.5, 2.5), 1), "category": "low"},
            {"disease": "Other NIH Classes", "probability": round(random.uniform(0.5, 2.0), 1), "category": "low"}
        ]
    else:
        # Pick primary abnormal disease
        primary_disease = random.choice(["Pneumonia", "Tuberculosis", "Pulmonary Fibrosis", "Cardiomegaly", "Infiltration"])
        primary_condition = f"{primary_disease} Detected"
        confidence = round(random.uniform(74.0, 94.0), 1)
        severity = random.choice(["Moderate", "High"])
        
        if primary_disease == "Pneumonia":
            affected_area = "Right Lower Lobe"
            findings = "Air-space consolidation and focal opacification observed in the right lower lung zone. Clinical correlation and follow-up recommended."
            marker_3d = {"x": 0.65, "y": -0.95, "z": 0.35, "label": "Abnormality Detected", "regionName": "Right Lower Lobe (Consolidation)"}
        elif primary_disease == "Tuberculosis":
            affected_area = "Apical Left Upper Lobe"
            findings = "Cavitary lesion and patchy upper lobe opacities noted in the apical left lung region. Sputum AFB and GeneXpert test recommended."
            marker_3d = {"x": -0.45, "y": 0.60, "z": 0.20, "label": "Abnormality Detected", "regionName": "Left Upper Lobe (Apical Cavity)"}
        elif primary_disease == "Pulmonary Fibrosis":
            affected_area = "Bilateral Basal Zones"
            findings = "Reticular opacities with peripheral honeycombing pattern observed bilaterally in lower pulmonary zones."
            marker_3d = {"x": 0.35, "y": -0.70, "z": 0.15, "label": "Abnormality Detected", "regionName": "Bilateral Basal Fibrosis"}
        else:
            affected_area = "Cardiothoracic Region"
            findings = "Enlarged cardiac silhouette with vascular congestion. Recommend echocardiogram evaluation."
            marker_3d = {"x": -0.15, "y": -0.30, "z": 0.30, "label": "Abnormality Detected", "regionName": "Cardiomegaly (Cardiac Shadow)"}

        # Generate realistic probability breakdown
        rem_prob = 100.0 - confidence
        p2 = round(rem_prob * random.uniform(0.4, 0.6), 1)
        p3 = round((rem_prob - p2) * random.uniform(0.5, 0.8), 1)
        p4 = round(max(0.1, rem_prob - p2 - p3), 1)
        
        disease_breakdown = [
            {"disease": primary_disease, "probability": confidence, "category": "primary"},
            {"disease": "Infiltration", "probability": p2, "category": "secondary"},
            {"disease": "Atelectasis", "probability": p3, "category": "low"},
            {"disease": "Other NIH Classes", "probability": p4, "category": "low"}
        ]

    latency = round(time.time() - start_time + random.uniform(1.4, 2.2), 2)
    
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
