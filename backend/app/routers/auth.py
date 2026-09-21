from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas, crud, auth, models

# Note: Prototype-level authentication router.
# Scope limitations: No password reset flow, no email verification, no rate limiting.

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.LoginRequest, response: Response, db: Session = Depends(get_db)):
    """
    Doctor Authentication Endpoint.
    Validates email and password, generates JWT session token, and sets httpOnly session cookie.
    """
    if not credentials.email or not credentials.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required"
        )

    doctor = crud.get_doctor_by_email(db, credentials.email)
    if not doctor or not auth.verify_password(credentials.password, doctor.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token payload
    access_token = auth.create_access_token(
        data={"sub": doctor.id, "email": doctor.email, "name": doctor.name}
    )

    # Set httpOnly Cookie for secure browser session handling
    response.set_cookie(
        key="session_token",
        value=access_token,
        httponly=True,
        max_age=60 * 60 * 24, # 24 hours
        samesite="lax",
        secure=False, # prototype environment (http/localhost)
    )

    return schemas.TokenResponse(
        access_token=access_token,
        token_type="bearer",
        doctor=schemas.DoctorOut.model_validate(doctor)
    )

@router.post("/logout")
def logout(response: Response):
    """
    Logout Endpoint. Clears session token cookie.
    """
    response.delete_cookie(key="session_token")
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=schemas.DoctorOut)
def get_current_doctor_profile(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Get profile of currently authenticated doctor.
    """
    doctor = auth.get_current_doctor_optional(request, db)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return schemas.DoctorOut.model_validate(doctor)
