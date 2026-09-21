import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/scans", tags=["scans"])

def format_scan_response(s, db: Session) -> schemas.ScanResponse:
    patient = crud.get_patient_by_id(db, s.patient_id)
    patient_name = patient.name if patient else "Unknown Patient"
    
    marker_3d = json.loads(s.marker_3d_json) if s.marker_3d_json else None
    disease_breakdown = json.loads(s.disease_breakdown_json) if s.disease_breakdown_json else []

    return schemas.ScanResponse(
        id=s.id,
        scanCode=s.scan_code,
        patientId=s.patient_id or "pat-001",
        patientName=patient_name,
        scanDate=s.scan_date,
        imageUrl=s.image_url,
        heatmapUrl=s.heatmap_url or s.image_url,
        primaryCondition=s.primary_condition,
        confidence=s.confidence,
        severity=s.severity,
        affectedArea=s.affected_area,
        analysisTimeSeconds=s.analysis_time_seconds,
        findingsSummary=s.findings_summary,
        isNormal=s.is_normal,
        marker3D=marker_3d,
        diseaseBreakdown=disease_breakdown,
    )

@router.get("", response_model=List[schemas.ScanResponse])
def read_scans(patient_id: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    scans = crud.get_scans(db, patient_id=patient_id, skip=skip, limit=limit)
    return [format_scan_response(s, db) for s in scans]

@router.get("/{scan_id}", response_model=schemas.ScanResponse)
def read_scan_by_id(scan_id: str, db: Session = Depends(get_db)):
    scan = crud.get_scan_by_id(db, scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
    return format_scan_response(scan, db)
