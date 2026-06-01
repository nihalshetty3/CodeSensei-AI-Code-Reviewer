from dotenv import load_dotenv
import os
load_dotenv(".env")

print(
    "TOKEN EXISTS:",
    bool(os.getenv("GITHUB_TOKEN"))
)

from fastapi import FastAPI
from app.routes.review import router as review_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.github_webhook import router as webhook_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(review_router)
@app.get("/")
def home():
    return {"message" : "AI service running"}

app.include_router(
    webhook_router
)