from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import ChatRequest
from app.services.retrieval import retrieve_relevant_chunks
from app.services.llm import stream_gemini_response

router = APIRouter()


@router.post("/")
async def chat(payload: ChatRequest):
    chunks = await retrieve_relevant_chunks(
        query=payload.message,
        document_id=payload.document_id,
    )
    context = "\n\n---\n\n".join(c["content"] for c in chunks)

    async def event_stream():
        async for token in stream_gemini_response(payload.message, context):
            yield token

    return StreamingResponse(event_stream(), media_type="text/plain")
