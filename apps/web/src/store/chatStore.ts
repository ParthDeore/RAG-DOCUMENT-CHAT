import { create } from "zustand";
import { ChatMessage } from "@/lib/types";

interface ChatState {
  messages: ChatMessage[];
  activeDocumentId: string | null;
  isStreaming: boolean;
  setActiveDocumentId: (id: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  activeDocumentId: null,
  isStreaming: false,

  setActiveDocumentId: (id) => set({ activeDocumentId: id }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = { ...last, content: last.content + content };
      }
      return { messages };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),

  clearMessages: () => set({ messages: [] }),
}));
