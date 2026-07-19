from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.chunking import chunk_text
from app.services.embeddings import embed_texts
from app.utils.pdf_parser import extract_text_from_pdf
from app.db.supabase_client import supabase

router = APIRouter()

ALLOWED_TYPES = {"application/pdf", "text/plain"}
MAX_FILE_SIZE_MB = 20


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only PDF or plain text files are supported.")

    raw_bytes = await file.read()

    if len(raw_bytes) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(400, f"File exceeds {MAX_FILE_SIZE_MB}MB limit.")

    if file.content_type == "application/pdf":
        text = extract_text_from_pdf(raw_bytes)
    else:
        text = raw_bytes.decode("utf-8", errors="ignore")

    # 1. Create the document row first (status: processing)
    doc_insert = supabase.table("documents").insert({
        "file_name": file.filename,
        "file_type": file.content_type,
        "file_size_bytes": len(raw_bytes),
        "status": "processing",
    }).execute()
    document_id = doc_insert.data[0]["id"]

    try:
        # 2. Chunk + embed
        chunks = chunk_text(text)
        if not chunks:
            raise HTTPException(422, "No usable text extracted from this file.")

        embeddings = await embed_texts(chunks, task_type="RETRIEVAL_DOCUMENT")

        rows = [
            {
                "document_id": document_id,
                "content": chunk,
                "chunk_index": i,
                "embedding": embedding,
            }
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings))
        ]
        supabase.table("document_chunks").insert(rows).execute()

        # 3. Mark ready
        supabase.table("documents").update({"status": "ready"}).eq("id", document_id).execute()

    except Exception as exc:
        supabase.table("documents").update({"status": "failed"}).eq("id", document_id).execute()
        raise HTTPException(500, f"Failed to process document: {exc}")

    return {"document_id": document_id, "chunks_created": len(chunks)}


@router.get("/")
async def list_documents():
    result = (
        supabase.table("documents")
        .select("*")
        .order("uploaded_at", desc=True)
        .execute()
    )
    return result.data


@router.delete("/{document_id}")
async def delete_document(document_id: str):
    # document_chunks has ON DELETE CASCADE, so this removes chunks too.
    supabase.table("documents").delete().eq("id", document_id).execute()
    return {"deleted": document_id}
