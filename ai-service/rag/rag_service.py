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
            return {
                "success": True,
                "source": "local",
                "context": "\n\n".join(
                    docs
                )
            }
            
        #Fallback to Tavily Search
        web_content = search_web(
            issue
        )
        
        return {
            "success": True,
            "source": "web",
            "context": web_content
        }
    except Exception as e:
        
        return {
            "success": False,
            "source": None,
            "context": "",
            "error": str(e)
        }