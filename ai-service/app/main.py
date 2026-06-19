from dotenv import load_dotenv
import os
load_dotenv(".env")

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.review import router as review_router
from fastapi.middleware.cors import CORSMiddleware
from app.routes.github_webhook import router as webhook_router
from app.routes.rag import router as rag_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:5176",
        "http://127.0.0.1:5177",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/docs",
    StaticFiles(directory="rag/docs"),
    name="docs"
)

app.include_router(review_router)
app.include_router(webhook_router)
app.include_router(rag_router)
@app.get("/")
def home():
    return {"message" : "AI service running"}
