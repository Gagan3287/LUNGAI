import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_code = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    last_scan_date = Column(String)
    referring_doctor = Column(String, default="Dr. Arjun Patel")
    history_notes = Column(Text, nullable=True)
    status = Column(String, default="Normal")
    created_at = Column(DateTime, default=datetime.utcnow)

    scans = relationship("Scan", back_populates="patient", cascade="all, delete-orphan")


class Scan(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_code = Column(String, unique=True, index=True)
    patient_id = Column(String, ForeignKey("patients.id"))
    scan_date = Column(String)
    image_url = Column(String)
    heatmap_url = Column(String, nullable=True)
    primary_condition = Column(String)
    confidence = Column(Float)
    severity = Column(String)
    affected_area = Column(String)
    analysis_time_seconds = Column(Float)
    findings_summary = Column(Text)
    is_normal = Column(Boolean, default=False)
    marker_3d_json = Column(Text, nullable=True)
    disease_breakdown_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="scans")
    inference_logs = relationship("InferenceLog", back_populates="scan", cascade="all, delete-orphan")


class InferenceLog(Base):
    __tablename__ = "inference_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    scan_id = Column(String, ForeignKey("scans.id"))
    model_name = Column(String, default="ResNet50-NIH-ChestXray14")
    inference_latency_ms = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="inference_logs")


class Doctor(Base):
    """
    Doctor model for prototype-level authentication.
    Note: Prototype-level auth system — no password reset flow, no email verification, no rate limiting.
    """
    __tablename__ = "doctors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    specialization = Column(String, nullable=False, default="Pulmonology & Radiology")
    created_at = Column(DateTime, default=datetime.utcnow)
