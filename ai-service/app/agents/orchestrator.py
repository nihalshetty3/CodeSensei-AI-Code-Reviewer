from app.agents.bug_agent import (
    bug_agent
)

from app.agents.security_agent import (
    security_agent
)

from app.agents.performance_agent import (
    performance_agent
)

def orchestrate_review(
    code,
    language
):
    
    bug_results = bug_agent(
        code,
        language
    )
    
    security_results = security_agent(
        code,
        language
    )
    
    performance_results = performance_agent(
        code,
        language
    )
    
    return {
        "bugs":
            bug_results["bugs"],
        
        "security":
            security_results["security"],
            
        "performance":
            performance_results["performance"]
    }