import asyncio
from google import genai
from google.genai import types
from app.config import settings

client = genai.Client(api_key=settings.gemini_api_key)

EMBEDDING_MODEL = "gemini-embedding-001"  # text-embedding-004 was retired Jan 14 2026
EMBEDDING_DIM = 768  # matches the vector(768) column in the Supabase schema
BATCH_SIZE = 100


def _embed_batch_sync(texts: list[str], task_type: str) -> list[list[float]]:
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(
            task_type=task_type,
            output_dimensionality=EMBEDDING_DIM,
        ),
    )
    return [e.values for e in result.embeddings]


async def embed_texts(
    texts: list[str],
    task_type: str = "RETRIEVAL_DOCUMENT",
) -> list[list[float]]:
    """
    Embed a list of strings with Gemini's gemini-embedding-001 model.
    task_type should be "RETRIEVAL_DOCUMENT" when embedding chunks to store,
    and "RETRIEVAL_QUERY" when embedding an incoming user question.
    Runs the (blocking) SDK call in a thread so it doesn't block the event loop.
    """
    all_embeddings: list[list[float]] = []

    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i:i + BATCH_SIZE]
        batch_embeddings = await asyncio.to_thread(_embed_batch_sync, batch, task_type)
        all_embeddings.extend(batch_embeddings)

    return all_embeddings