"use client";

import { useEffect, useRef } from "react";
import { MessageSquareText } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export function ChatWindow() {
  const { messages, isStreaming, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <MessageSquareText className="h-8 w-8 text-ink-700/25" />
            <div>
              <p className="font-display text-lg text-ink-900">Ask your documents anything</p>
              <p className="mt-1 max-w-sm text-sm text-ink-700/50">
                Upload a file on the left, then ask a question — answers are grounded
                in what's actually written in your documents.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-paper-200 bg-paper-50 px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
