from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import documents, chat
from app.config import settings

app = FastAPI(title="RAG Document Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/documents", tags=["documents"])
app.include_router(chat.router, prefix="/chat", tags=["chat"])


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/")
async def root():
    return {"message": "RAG Document Chat API is running"}
