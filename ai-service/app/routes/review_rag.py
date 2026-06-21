from pydantic import BaseModel
from fastapi import APIRouter
from rag.db_review_service import get_review_context
from rag.llm_service import answer_with_rag

router=APIRouter()

class ReviewQuery(BaseModel):
    query: str
    
@router.post("/rag/reviews")
def review_chat(request: ReviewQuery):
    
    context = get_review_context()
    
    answer = answer_with_rag(
        request.query,
        context
    )
    
    return {
        "answer": answer,
        "context_length": len(context)
    }