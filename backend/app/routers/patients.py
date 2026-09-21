from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/patients", tags=["patients"])

@router.get("", response_model=List[schemas.PatientResponse])
def read_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = crud.get_patients(db, skip=skip, limit=limit)
    return [
        schemas.PatientResponse(
            id=p.id,
            patientCode=p.patient_code,
            name=p.name,
            age=p.age,
            gender=p.gender,
            lastScanDate=p.last_scan_date,
            referringDoctor=p.referring_doctor,
            historyNotes=p.history_notes or "",
            status=p.status,
            totalScans=len(p.scans) if p.scans else 1,
        )
        for p in patients
    ]

@router.post("", response_model=schemas.PatientResponse, status_code=status.HTTP_201_CREATED)
def create_new_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    p = crud.create_patient(db, patient)
    return schemas.PatientResponse(
        id=p.id,
        patientCode=p.patient_code,
        name=p.name,
        age=p.age,
        gender=p.gender,
        lastScanDate=p.last_scan_date,
        referringDoctor=p.referring_doctor,
        historyNotes=p.history_notes or "",
        status=p.status,
        totalScans=1,
    )

@router.get("/{patient_id}", response_model=schemas.PatientResponse)
def read_patient(patient_id: str, db: Session = Depends(get_db)):
    p = crud.get_patient_by_id(db, patient_id)
    if not p:
        raise HTTPException(status_code=404, detail="Patient record not found")
    return schemas.PatientResponse(
        id=p.id,
        patientCode=p.patient_code,
        name=p.name,
        age=p.age,
        gender=p.gender,
        lastScanDate=p.last_scan_date,
        referringDoctor=p.referring_doctor,
        historyNotes=p.history_notes or "",
        status=p.status,
        totalScans=len(p.scans) if p.scans else 1,
    )
