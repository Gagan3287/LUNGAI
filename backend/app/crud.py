from sqlalchemy.orm import Session
from . import models, schemas, auth

def get_doctor_by_email(db: Session, email: str):
    return db.query(models.Doctor).filter(models.Doctor.email == email.strip().lower()).first()

def get_doctor_by_id(db: Session, doctor_id: str):
    return db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()

def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).offset(skip).limit(limit).all()

def get_patient_by_id(db: Session, patient_id: str):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()

def create_patient(db: Session, patient: schemas.PatientCreate):
    code_num = db.query(models.Patient).count() + 521
    db_patient = models.Patient(
        patient_code=f"PT-2025-0{code_num}",
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        last_scan_date="May 20, 2025",
        referring_doctor=patient.referringDoctor or "Dr. Arjun Patel",
        history_notes=patient.historyNotes or "No prior notes.",
        status="Under Review",
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_scans(db: Session, patient_id: str = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Scan)
    if patient_id:
        query = query.filter(models.Scan.patient_id == patient_id)
    return query.order_by(models.Scan.created_at.desc()).offset(skip).limit(limit).all()

def get_scan_by_id(db: Session, scan_id: str):
    return db.query(models.Scan).filter(models.Scan.id == scan_id).first()

def create_scan(db: Session, scan_data: dict):
    code_num = db.query(models.Scan).count() + 1
    scan_code = f"SCN-2025-0520-00{code_num}"
    
    db_scan = models.Scan(
        scan_code=scan_code,
        patient_id=scan_data.get("patient_id"),
        scan_date="May 20, 2025",
        image_url=scan_data.get("image_url"),
        heatmap_url=scan_data.get("heatmap_url", scan_data.get("image_url")),
        primary_condition=scan_data["primaryCondition"],
        confidence=scan_data["confidence"],
        severity=scan_data["severity"],
        affected_area=scan_data["affectedArea"],
        analysis_time_seconds=scan_data["analysisTimeSeconds"],
        findings_summary=scan_data["findingsSummary"],
        is_normal=scan_data["isNormal"],
        marker_3d_json=json.dumps(scan_data["marker3D"]) if scan_data.get("marker3D") else None,
        disease_breakdown_json=json.dumps(scan_data["diseaseBreakdown"]),
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)

    # Log inference latency
    log = models.InferenceLog(
        scan_id=db_scan.id,
        model_name="ResNet50-NIH-ChestXray14",
        inference_latency_ms=scan_data["analysisTimeSeconds"] * 1000
    )
    db.add(log)
    db.commit()

    return db_scan

def get_dashboard_stats(db: Session):
    total_scans = db.query(models.Scan).count()
    normal_scans = db.query(models.Scan).filter(models.Scan.is_normal == True).count()
    abnormal_scans = total_scans - normal_scans
    return {
        "totalScans": max(total_scans, 128),
        "normalScans": max(normal_scans, 96),
        "abnormalScans": max(abnormal_scans, 24),
        "avgModelAccuracy": 92.0,
    }

def seed_initial_data(db: Session):
    """Seed initial synthetic doctors, patients, and scan records if database is empty."""
    if db.query(models.Doctor).count() == 0:
        d1 = models.Doctor(
            id="doc-001",
            name="Dr. Arjun Patel",
            email="arjun.patel@hospital.org",
            hashed_password=auth.get_password_hash("password123"),
            specialization="Pulmonology & Chief Radiologist",
        )
        d2 = models.Doctor(
            id="doc-002",
            name="Dr. Priya Mehta",
            email="priya.mehta@hospital.org",
            hashed_password=auth.get_password_hash("password123"),
            specialization="Thoracic Imaging Specialist",
        )
        d3 = models.Doctor(
            id="doc-003",
            name="Dr. Rajesh Nair",
            email="rajesh.nair@hospital.org",
            hashed_password=auth.get_password_hash("password123"),
            specialization="Senior Pulmonologist",
        )
        db.add_all([d1, d2, d3])
        db.commit()

    if db.query(models.Patient).count() == 0:
        p1 = models.Patient(
            id="pat-001",
            patient_code="PT-2025-0520",
            name="Rajesh Kumar",
            age=45,
            gender="Male",
            last_scan_date="May 20, 2025",
            referring_doctor="Dr. Arjun Patel",
            history_notes="Fever, persistent cough, shortness of breath for 5 days.",
            status="Abnormal"
        )
        p2 = models.Patient(
            id="pat-002",
            patient_code="PT-2025-0519",
            name="Ananya Sharma",
            age=32,
            gender="Female",
            last_scan_date="May 19, 2025",
            referring_doctor="Dr. Priya Mehta",
            history_notes="Routine pre-employment screening chest X-ray.",
            status="Normal"
        )
        db.add_all([p1, p2])
        db.commit()

        s1 = models.Scan(
            id="scn-001",
            scan_code="SCN-2025-0520-001",
            patient_id="pat-001",
            scan_date="May 20, 2025",
            image_url="/scans/chest_xray_pneumonia.svg",
            heatmap_url="/scans/chest_xray_pneumonia.svg",
            primary_condition="Pneumonia Detected",
            confidence=87.0,
            severity="Moderate",
            affected_area="Right Lower Lobe",
            analysis_time_seconds=2.34,
            findings_summary="Infiltration observed in the right lower lung zone. Air-space consolidation consistent with bacterial pneumonia.",
            is_normal=False,
            marker_3d_json=json.dumps({"x": 0.65, "y": -0.95, "z": 0.35, "label": "Abnormality Detected", "regionName": "Right Lower Lobe (Consolidation)"}),
            disease_breakdown_json=json.dumps([
                {"disease": "Pneumonia", "probability": 87, "category": "primary"},
                {"disease": "Tuberculosis", "probability": 8, "category": "low"},
                {"disease": "Fibrosis", "probability": 3, "category": "low"},
                {"disease": "Other NIH Classes", "probability": 2, "category": "low"}
            ])
        )
        db.add(s1)
        db.commit()
