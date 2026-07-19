import ReactMarkdown from "react-markdown";
import { ChatMessage as ChatMessageType } from "@/lib/types";
import { StreamingIndicator } from "./StreamingIndicator";
import { cn } from "@/lib/utils";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const showTyping = message.isStreaming && message.content.length === 0;

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5",
          isUser
            ? "bg-ink-900 text-paper-50"
            : "bg-paper-100 text-ink-900 border border-paper-200"
        )}
      >
        {showTyping ? (
          <StreamingIndicator />
        ) : isUser ? (
          <p className="prose-chat whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-chat">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
