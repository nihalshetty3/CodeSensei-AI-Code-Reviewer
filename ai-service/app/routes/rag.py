from fastapi import APIRouter
from pydantic import BaseModel
from rag.llm_service import answer_with_rag
from rag.rag_service import get_rag_content

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    
@router.post("/rag/query")
def rag_query(request: QueryRequest):
    rag_result = get_rag_content(
        request.query
    )
    
    answer = answer_with_rag(
        request.query,
        rag_result["context"]
    )
    
    return {
       "answer": answer,
        "source": rag_result["source"],
        "documents": rag_result["documents"]
    }