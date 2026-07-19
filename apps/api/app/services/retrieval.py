from app.db.supabase_client import supabase
from app.services.embeddings import embed_texts


async def retrieve_relevant_chunks(
    query: str,
    match_count: int = 5,
    document_id: str | None = None,
) -> list[dict]:
    """Embed the user's query and run a cosine-similarity search via the
    match_documents Postgres function defined in the Supabase migration."""
    query_embedding = (await embed_texts([query], task_type="RETRIEVAL_QUERY"))[0]

    result = supabase.rpc(
        "match_documents",
        {
            "query_embedding": query_embedding,
            "match_count": match_count,
            "filter_document_id": document_id,
        },
    ).execute()

    return result.data or []
