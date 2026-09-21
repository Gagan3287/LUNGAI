import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import engine, Base, SessionLocal
from . import crud
from .routers import patients, scans, inference, stats, auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LungAI API",
    description="Backend API for LungAI Chest X-Ray Multi-Disease Detection Prototype",
    version="1.0.0",
)

# Configure CORS Middleware (flexible origin handling per addendum)
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
else:
    origins = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "*"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files mount for uploaded X-ray scans
uploads_path = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_path, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_path), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(inference.router)
app.include_router(scans.router)
app.include_router(patients.router)
app.include_router(stats.router)

@app.on_event("startup")
def startup_events():
    # 1. Seed initial DB data
    db = SessionLocal()
    try:
        crud.seed_initial_data(db)
    finally:
        db.close()

    # 2. Pre-load real model & log state_dict sanity check on backend startup
    use_real = os.getenv("USE_REAL_MODEL", "true").lower() in ("true", "1", "yes")
    if use_real:
        try:
            from .ml.real_inference import get_inference_model
            get_inference_model()
        except Exception as e:
            print(f">> [REAL INFERENCE WARNING] Could not pre-load real model on startup: {e}")

@app.get("/health", tags=["system"])
def health_check():
    return {
        "status": "online",
        "service": "LungAI Backend API",
        "environment": "prototype",
        "database": "SQLite",
        "use_real_model": os.getenv("USE_REAL_MODEL", "true").lower() in ("true", "1", "yes"),
    }
