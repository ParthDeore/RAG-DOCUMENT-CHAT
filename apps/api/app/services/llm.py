from google import genai
from google.genai import types
from app.config import settings

client = genai.Client(api_key=settings.gemini_api_key)

CHAT_MODEL = "gemini-3.5-flash"  # gemini-2.0-flash and gemini-2.5-flash are both retired for new API keys

SYSTEM_INSTRUCTION = """You are a helpful assistant that answers questions strictly using the
provided document context. If the answer isn't contained in the context, say so honestly
instead of guessing. Keep answers clear and well-formatted with markdown where useful."""


async def stream_gemini_response(query: str, context: str):
    """
    Streams tokens from Gemini given retrieved context + the user's question.
    Yields plain text chunks suitable for a FastAPI StreamingResponse.
    """
    prompt = f"""Context from the document(s):
---
{context if context.strip() else "No relevant context was found in the uploaded documents."}
---

Question: {query}

Answer the question using only the context above."""

    stream = client.models.generate_content_stream(
        model=CHAT_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_INSTRUCTION,
        ),
    )

    for chunk in stream:
        if chunk.text:
            yield chunk.text