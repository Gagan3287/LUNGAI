from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from .. import crud, schemas

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("", response_model=schemas.StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    stats = crud.get_dashboard_stats(db)
    return schemas.StatsResponse(
        totalScans=stats["totalScans"],
        normalScans=stats["normalScans"],
        abnormalScans=stats["abnormalScans"],
        avgModelAccuracy=stats["avgModelAccuracy"]
    )
