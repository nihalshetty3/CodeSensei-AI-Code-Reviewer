from pydantic import BaseModel

class PRReviewRequest(BaseModel):
    pr_url: str