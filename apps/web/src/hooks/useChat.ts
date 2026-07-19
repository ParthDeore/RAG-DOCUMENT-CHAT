import { useCallback } from "react";
import { useChatStore } from "@/store/chatStore";
import { streamChatResponse } from "@/lib/api";

export function useChat() {
  const {
    messages,
    activeDocumentId,
    isStreaming,
    addMessage,
    updateLastMessage,
    setStreaming,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;

      addMessage({ id: crypto.randomUUID(), role: "user", content });
      addMessage({ id: crypto.randomUUID(), role: "assistant", content: "", isStreaming: true });
      setStreaming(true);

      try {
        await streamChatResponse(content, activeDocumentId, (token) => {
          updateLastMessage(token);
        });
      } catch (err) {
        updateLastMessage("\n\n_Something went wrong reaching the assistant. Please try again._");
      } finally {
        setStreaming(false);
      }
    },
    [activeDocumentId, isStreaming, addMessage, updateLastMessage, setStreaming]
  );

  return { messages, isStreaming, sendMessage };
}
