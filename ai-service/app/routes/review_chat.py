from fastapi import APIRouter
from pydantic import BaseModel

from rag.db_review_service import get_review_context
from rag.llm_service import answer_with_rag

from rag.chat_memory import (
    get_history,
    save_message
)

router=APIRouter()

class ChatRequest(BaseModel):
    session_id : str
    message: str
    
@router.post("/rag/reviews/chat")
def review_chat(request: ChatRequest):
    
    context = get_review_context()
    
    history=get_history(
        request.session_id
    )
    
    result = answer_with_rag(
        request.message,
        context,
        history
    )
    answer = result["answer"]
    provider = result["provider"]
    
    save_message(
        request.session_id,
        "user",
        request.message
    )
    
    save_message(
        request.session_id,
        "assistant",
        answer
    )
    
    return {
        "answer": answer,
        "provider": provider
    }