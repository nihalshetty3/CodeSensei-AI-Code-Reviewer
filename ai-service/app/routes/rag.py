from typing import List
from fastapi import APIRouter
from pydantic import BaseModel
from rag.llm_service import answer_with_rag
from rag.rag_service import get_rag_content

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    
class ChatRequest(BaseModel):
    message: str
    history: list = []
    
@router.post("/rag/query")
def rag_query(request: QueryRequest):
    rag_result = get_rag_content(
        request.query
    )
    
    answer = answer_with_rag(
        request.query,
        rag_result["context"]
    )
    
    docs = [
        {
            "name": doc,
            "url": f"/docs/{doc}"
        }
        for doc in rag_result["documents"]
    ]
    
    return {
       "answer": answer,
        "source": rag_result["source"],
        "documents": docs
    }
    
@router.post("/rag/chat")
def rag_chat(request: ChatRequest):
    
    rag_result = get_rag_content(
        request.message
    )
    
    answer = answer_with_rag(
        request.message,
        rag_result["context"],
        request.history
    )
    
    docs = [
        {
            "name": doc,
            "url": f"/docs/{doc}"
        }
        for doc in rag_result["documents"]
    ]
    
    return {
        "answer": answer,
        "source": rag_result["source"],
        "documents": docs
    }