from fastapi import APIRouter, UploadFile, File
from typing import List
from app.utils.zip_parser import parse_zip

from app.schemas.review_schema import ReviewRequest
from app.services.review_service import(
    generate_review,
    generate_repositoryy_summary
)
from app.utils.file_parser import parse_file

import tempfile
import os

router = APIRouter()


# Manual code uploading review endpoint
@router.post("/review")
async def review_code(data: ReviewRequest):

    review = generate_review(
        data.code,
        data.language
    )

    return {
        "success": True,
        "review": review
    }


# Multi-file upload review endpoint
@router.post("/upload-review")
async def upload_review(
    files: List[UploadFile] = File(...)
):

    reviewed_files = []
    
    for file in files:
        
        content = await file.read()
        
        parsed_data = parse_file(
            file.filename,
            content
        )
        
        review = generate_review(
            parsed_data["code"],
            parsed_data["language"]
        )
        
        reviewed_files.append({
            "filename": file.filename,
            "language": parsed_data["language"],
            "review": review
        })
        
    return {
        "success": True,
        "files": reviewed_files
    }
    
#For Zip parsing logic
@router.post("/upload-zip-review")
async def upload_zip_review(
    file : UploadFile = File(...)
):

    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=".zip"
    ) as temp_zip:
        
        content = await file.read()
        
        temp_zip.write(content)
        
        temp_zip_path = temp_zip.name 
        
    #Extract and parse the entire repository
    parsed_files = parse_zip(temp_zip_path)
    
    reviewed_files = []
    
    for parsed_file in parsed_files:
        
        review = generate_review(
            parsed_file["code"],
            parsed_file["language"]
        )
        
        reviewed_files.append({
            "filename": parsed_file["filename"],
            "language": parsed_file["language"],
            "review": review
        })
    
    os.remove(temp_zip_path)
    
    summary = generate_repositoryy_summary(
        reviewed_files
    )
    
    return {
        "success": True,
        "total_files": len(reviewed_files),
        "summary": summary,
        "files": reviewed_files
    }