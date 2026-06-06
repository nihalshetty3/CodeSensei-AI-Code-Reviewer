from rag.vector_store import retrieve_context
from app.services.tavily_search import search_web

SIMILARITY_THRESHOLD= 1.0

def get_rag_content(
    issue: str
):
    
    try:
        
        result = retrieve_context(
            issue
        )
        
        docs= result["documents"]
        
        distance = result["distance"]
        
        print(
            f"FAISS Distance: {distance}"
        )
        
        #if local match -> good
        if distance <= SIMILARITY_THRESHOLD:
            
            context = "\n\n".join(
                [
                    doc["content"]
                    for doc in docs
                ]
            )
            
            sources = list(
                set(
                    [
                        doc["source"]
                        for doc in docs
                    ]
                )
            )
            
            return {
                "success": True,
                "source": "local",
                "documents": sources,
                "context": context
            }
            
        #Fallback to Tavily Search
        web_content = search_web(
            issue
        )
        
        return {
            "success": True,
            "source": "web",
            "documents": [],
            "context": web_content
        }
    except Exception as e:
        
        return {
            "success": False,
            "source": None,
            "documents": [],
            "context": "",
            "error": str(e)
        }