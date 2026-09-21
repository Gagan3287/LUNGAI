import os
import uuid
import logging
from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas
from ..services.mock_inference import run_mock_inference
from .scans import format_scan_response

logger = logging.getLogger("lungai.inference")

router = APIRouter(prefix="/api/scans", tags=["inference"])

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

USE_REAL_MODEL = os.getenv("USE_REAL_MODEL", "true").lower() in ("true", "1", "yes")


@router.post("/upload", response_model=schemas.ScanResponse, status_code=status.HTTP_201_CREATED)
async def upload_and_predict(
    file: UploadFile = File(...),
    patient_id: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Uploads a chest X-ray image (JPG/PNG) and triggers AI multi-disease classification.
    Uses real DenseNet121 model when USE_REAL_MODEL=true (default: true).
    """
    # 1. Validate File Format (JPG/PNG only)
    allowed_extensions = [".jpg", ".jpeg", ".png"]
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Only JPG and PNG images are supported."
        )

    # 2. Save Uploaded File to backend/app/uploads/
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(UPLOADS_DIR, unique_filename)

    contents = await file.read()
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as f:
        f.write(contents)

    image_url = f"/uploads/{unique_filename}"

    # 3. Ensure Patient Exists or Use Default
    if not patient_id:
        patients = crud.get_patients(db, limit=1)
        if patients:
            patient_id = patients[0].id
        else:
            p = crud.create_patient(db, schemas.PatientCreate(name="Rajesh Kumar", age=45, gender="Male"))
            patient_id = p.id

    # 4. Trigger AI Inference (Real DenseNet121 PyTorch model or Mock fallback)
    if USE_REAL_MODEL:
        try:
            from ..ml.real_inference import run_real_inference
            inference_result = run_real_inference(file_path)
            logger.info(f"[INFERENCE] Real DenseNet121 inference complete for scan {unique_filename}")
        except Exception as e:
            logger.warning(f"[INFERENCE] Real model inference failed ({e}), falling back to mock inference.")
            inference_result = run_mock_inference(unique_filename, patient_id)
    else:
        inference_result = run_mock_inference(unique_filename, patient_id)

    inference_result["patient_id"] = patient_id
    inference_result["image_url"] = image_url
    inference_result["heatmap_url"] = image_url

    # 5. Persist Scan Record to Database
    db_scan = crud.create_scan(db, inference_result)

    return format_scan_response(db_scan, db)
