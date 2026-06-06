from app.services.agent_review_service import performance_review

def performance_agent(
    code,
    language
):
    
    return performance_review(
        code,
        language
    )