from rag.rag_service import get_rag_content
from rag.llm_service import answer_with_rag

query="React dependency array"

result = get_rag_content(
    query
)

answer = answer_with_rag(
    query,
    result["context"]
)

print(answer)