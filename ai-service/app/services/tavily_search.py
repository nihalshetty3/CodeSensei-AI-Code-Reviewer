from tavily import TavilyClient
import os

client = TavilyClient(
    api_key = os.getenv(
        "TAVILY_API_KEY"
    )
)

def search_web(query):
    
    response = client.search(
        query=query,
        max_results=3
    )
    
    content = []
    
    for result in response["results"]:
        
        content.append(
            result["content"]
        )
        
    return "\n".join(
        content
    )