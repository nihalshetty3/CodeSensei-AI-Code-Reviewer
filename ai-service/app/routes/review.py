from fastapi import APIRouter
from app.schemas.review_schema import ReviewRequest
from app.services.review_service import generate_review

router = APIRouter()

@router.post("/review")
async def review_code(data:ReviewRequest):
    
    review = generate_review(
        data.code,
        data.language
    )
    
    return {
        "success":True,
        "review":review
    }