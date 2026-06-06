from app.services.agent_review_service import bug_review

def bug_agent(code , language):
    
    return bug_review(
        code,
        language
    )