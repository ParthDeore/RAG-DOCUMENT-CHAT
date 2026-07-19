from pydantic import BaseModel
from typing import Optional


class DocumentOut(BaseModel):
    id: str
    file_name: str
    file_type: str
    file_size_bytes: Optional[int] = None
    status: str
    uploaded_at: str


class UploadResponse(BaseModel):
    document_id: str
    chunks_created: int


class ChatRequest(BaseModel):
    message: str
    document_id: Optional[str] = None
    history: Optional[list[dict]] = None


class RetrievedChunk(BaseModel):
    id: str
    document_id: str
    content: str
    similarity: float
