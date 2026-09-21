from typing import List, Optional
from pydantic import BaseModel, Field

class DiseaseProbabilitySchema(BaseModel):
    disease: str
    probability: float
    category: Optional[str] = "low"

class Marker3DPositionSchema(BaseModel):
    x: float
    y: float
    z: float
    label: str
    regionName: str

# --- Patient Schemas ---
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    referringDoctor: Optional[str] = "Dr. Arjun Patel"
    historyNotes: Optional[str] = ""

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: str
    patientCode: str
    lastScanDate: str
    status: str
    totalScans: int = 1

    class Config:
        from_attributes = True

# --- Scan Schemas ---
class ScanResponse(BaseModel):
    id: str
    scanCode: str
    patientId: str
    patientName: str
    scanDate: str
    imageUrl: str
    heatmapUrl: Optional[str] = ""
    primaryCondition: str
    confidence: float
    severity: str
    affectedArea: str
    analysisTimeSeconds: float
    findingsSummary: str
    isNormal: bool
    marker3D: Optional[Marker3DPositionSchema] = None
    diseaseBreakdown: List[DiseaseProbabilitySchema]

    class Config:
        from_attributes = True

# --- Stats Schema ---
class StatsResponse(BaseModel):
    totalScans: int
    normalScans: int
    abnormalScans: int
    avgModelAccuracy: float = 92.0


# --- Doctor & Auth Schemas ---
class LoginRequest(BaseModel):
    email: str
    password: str

class DoctorOut(BaseModel):
    id: str
    name: str
    email: str
    specialization: str
    avatarUrl: Optional[str] = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&auto=format&fit=crop"

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    doctor: DoctorOut
