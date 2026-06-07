from pydantic import BaseModel

class ExplainRequest(BaseModel):
    issue:str
    framework: str