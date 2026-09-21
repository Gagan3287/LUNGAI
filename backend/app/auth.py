import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from fastapi import Request
from sqlalchemy.orm import Session
from . import models

# Note: Prototype-level authentication system.
# Scope limitations: No password reset flow, no email verification, no rate limiting.

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "lungai_prototype_secret_key_2025_safe_token")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours for prototype session

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

def get_current_doctor_optional(request: Request, db: Session) -> Optional[models.Doctor]:
    """
    Optional authentication middleware dependency to identify current doctor if token is present,
    without locking down existing endpoints for guest access.
    Extracts token from Authorization Header ('Bearer <token>') or 'session_token' httpOnly Cookie.
    """
    token = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
    elif "session_token" in request.cookies:
        token = request.cookies.get("session_token")
    
    if not token:
        return None

    payload = decode_access_token(token)
    if not payload:
        return None

    doctor_id = payload.get("sub")
    if not doctor_id:
        return None

    return db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
