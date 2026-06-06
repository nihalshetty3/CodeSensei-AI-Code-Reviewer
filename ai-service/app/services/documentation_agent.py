import asyncio
from fastmcp import Client 

async def explain_finding(
    issue,
    framework
):
    
    framework = framework.lower()
    
    if framework == "react":
        tool_name = "search_react_docs"
        topic = "useeffect"

    elif framework == "fastapi":
        tool_name = "search_fastapi_docs"
        topic = "path operation"

    elif framework == "security":
        tool_name = "search_owasp_docs"
        topic = "sql injection"

    else:
        return {
            "documentation":
            "No documentation source available."
        }
        
    client = Client(
        "mcp_server/docs_mcp.py"
    )
    
    async with client:
        result = await client.call_tool(
            tool_name,
            {
                "topic":topic
            }
        )
        
        doc_text = result.content[0].text
        
        return {
            "documentation": doc_text
        }