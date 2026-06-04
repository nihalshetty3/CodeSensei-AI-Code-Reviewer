from fastapi import APIRouter, UploadFile, File
from typing import List
from app.utils.zip_parser import parse_zip

from app.schemas.review_schema import ReviewRequest
from app.services.review_service import(
    generate_review,
    generate_repositoryy_summary
)
from app.utils.file_parser import parse_file
from app.schemas.repository_schema import RepositoryRequest
from app.utils.repo_parser import parse_repository
from app.schemas.pr_review_schema import PRReviewRequest
from app.services.github_service import (
    get_pr_files
)
from app.utils.language_detector import detect_language
from app.schemas.explain_schema import (
    ExplainRequest
)

from app.services.documentation_agent import (
    explain_finding
)

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
        
        print("====file===")
        print(file.filename)

        print("====code===")
        print(parsed_data["code"])

        print("==language==")
        print(parsed_data["language"])

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
    

#Endpoint for uploading Repo URL
@router.post("/repository-review")
async def repository_review(
    data: RepositoryRequest
):
    
    parsed_files = parse_repository(
        data.repo_url
    )
    
    reviewed_files = []
    
    for parsed_file in parsed_files:
        review = generate_review(
            parsed_file["code"],
            parsed_file["language"]
        )
        
        reviewed_files.append({
            "filename": parsed_file["filename"],
            "langauge": parsed_file["language"],
            "review": review
        })
        
    summary = generate_repositoryy_summary(
        reviewed_files
     )
    
    return {
        "success": True,
        "repository": data.repo_url,
        "total_files": len(reviewed_files),
        "summary": summary,
        "files": reviewed_files
    }
        
        
#end point for PR url
@router.post("/pr-review")
async def pr_review(
    data: PRReviewRequest
):
    
    pr_files = get_pr_files(
        data.pr_url
    )
    
    reviewed_files=[]
    
    for file in pr_files:
        
        language = detect_language(
            file["filename"]
        )
        review = generate_review(
            file["patch"],
            language
        )
        documentation=None
        
        review_lower = str(review).lower()
        if(
            "dependency" in review_lower
            or "useeffect" in review_lower
        ):
            documentation_response = await explain_finding(
                issue="dependency issue",
                framework="react"
            )
            
            documentation = documentation_response[
                "documentation"
            ]
            
        elif (
            "sql injection" in review_lower
        ):
            documentation_response = await explain_finding(
                issue="security issue",
                framework = "security"
            )
            
            documentation = documentation_response[
                "documentation"
            ]
        
        reviewed_files.append({
            "filename": file["filename"],
            "language" : language,
            "review": review,
            "documentation": documentation
        })
        
    summary = generate_repositoryy_summary(
        reviewed_files
    )
    
    return {
        "success": True,
        "pr_url": data.pr_url,
        "files_reviewed": len(reviewed_files),
        "summary": summary,
        "files" : reviewed_files
    }
    

@router.post("/explain-finding")
async def explain_issue(
    data: ExplainRequest
):
    
    response = await explain_finding(
        data.issue,
        data.framework
    )
    
    return {
        "success": True,
        "result": response
    }
    