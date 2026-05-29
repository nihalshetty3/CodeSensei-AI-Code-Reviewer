from fastapi import FastAPI
from app.routes.review import router as review_router

app = FastAPI()
app.include_router(review_router)
@app.get("/")
def home():
    return {"message" : "AI service running"}