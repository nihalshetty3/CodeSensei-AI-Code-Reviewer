from fastmcp import FastMCP

mcp = FastMCP(
    "CodeSensei Documentation MCP"
)

@mcp.tool()
def search_react_docs(topic: str):
    
    docs = {
        "useeffect": """
React useEffect runs after render.
Dependency array controls when effect executes.

Emoty dependency array [] means
effect runs once after initial render.
""",

        "state":"""
React state updates are asynchronous.

Use setState or state setters properly.
"""
    }
    
    return docs.get(
        topic.lower(),
        "No React documentation found."
    )
    
    
@mcp.tool()
def search_fastapi_docs(topic: str):
    
    docs = {
        "path operation": """
FastAPI path operations are created using
@app.get, @app.post , @app.put etc.

Functions are automatically converted
to API endpoints.
""",

        "pydantic": """
Pydantic validates requests and response data.
"""
    }
    
    return docs.get(
        topic.lower(),
        "No FastAPI documentation found."
    )
    

@mcp.tool()
def search_owasp_docs(topic: str):
    
    docs={
        "sql injection": """
OWASP recomends paramterized queries.
Never concatenate user input into SQL strings.
""",

        "xss": """
Escape user supplied HTML.
Use sanitizatio libraries.
"""   
    }
    
    return docs.get(
        topic.lower(),
        "No OWASP documentation found."
    )
    
if __name__ == "__main__":
    mcp.run()
    