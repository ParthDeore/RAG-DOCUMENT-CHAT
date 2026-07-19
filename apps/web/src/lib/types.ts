export type DocumentStatus = "processing" | "ready" | "failed";

export interface DocumentItem {
  id: string;
  file_name: string;
  file_type: string;
  file_size_bytes: number | null;
  status: DocumentStatus;
  uploaded_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}
