from fastapi import APIRouter
from app.schemas.review_schema import ReviewRequest
from app.services.review_service import generate_review
from fastapi import UploadFile , File
from app.utils.file_parser import parse_file

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
    
@router.post("/upload-review")
async def upload_review(file: UploadFile = File(...)):
    
    content = await file.read()
    
    parsed_data = parse_file(
        file.filename,
        content
    )
    
    review = generate_review(
        parsed_data["code"],
        parsed_data["language"]
    )
    
    return {
        "success": True,
        "filename": file.filename,
        "language": parsed_data["language"],
        "review": review
    }