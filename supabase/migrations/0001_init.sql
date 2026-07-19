-- Enable the pgvector extension
create extension if not exists vector;

-- Documents table: one row per uploaded file
create table documents (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  file_type text not null,
  file_size_bytes integer,
  status text not null default 'processing', -- processing | ready | failed
  uploaded_at timestamptz not null default now(),
  user_id uuid -- nullable for now; wire to auth.users later if you add login
);

-- Chunks table: one row per text chunk + its embedding
-- Gemini's text-embedding-004 model outputs 768-dim vectors
create table document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  chunk_index integer not null,
  embedding vector(768) not null,
  created_at timestamptz not null default now()
);

-- Vector similarity search function
create or replace function match_documents (
  query_embedding vector(768),
  match_count int default 5,
  filter_document_id uuid default null
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where filter_document_id is null or document_chunks.document_id = filter_document_id
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- NOTE: Add the ivfflat index AFTER you have some real data in document_chunks
-- (it needs sample data to build good clusters). Run this later, e.g. once
-- you have 100+ chunks:
--
-- create index on document_chunks
--   using ivfflat (embedding vector_cosine_ops)
--   with (lists = 100);
