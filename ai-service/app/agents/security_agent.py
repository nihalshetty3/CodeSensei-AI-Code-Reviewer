from app.services.agent_review_service import security_review

def security_agent(code , language):
    return security_review(
        code,
        language
    )