import { DocumentItem } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const res = await fetch(`${API_URL}/documents/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function uploadDocument(file: File): Promise<{ document_id: string; chunks_created: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function deleteDocument(documentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/documents/${documentId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete document");
}

/**
 * Streams a chat response token-by-token, calling onToken for each chunk
 * as it arrives from the FastAPI StreamingResponse.
 */
export async function streamChatResponse(
  message: string,
  documentId: string | null,
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_URL}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, document_id: documentId }),
    signal,
  });

  if (!res.ok || !res.body) {
    throw new Error("Chat request failed");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (text) onToken(text);
  }
}
