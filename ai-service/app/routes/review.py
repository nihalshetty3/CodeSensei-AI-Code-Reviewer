from fastapi import APIRouter
from app.schemas.review_schema import ReviewRequest

router = APIRouter()

@router.post("/review")
async def review_code(data:ReviewRequest):
    return{
        "success": True,
        "language":data.language,
        "received_code": data.code,
        "review": "Dummy AI review response"
    }