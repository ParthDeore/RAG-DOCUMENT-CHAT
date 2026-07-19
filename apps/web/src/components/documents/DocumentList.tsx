"use client";

import { DocumentItem } from "@/lib/types";
import { DocumentCard } from "./DocumentCard";
import { BookOpen } from "lucide-react";

interface DocumentListProps {
  documents: DocumentItem[];
  activeDocumentId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function DocumentList({
  documents,
  activeDocumentId,
  onSelect,
  onDelete,
  isLoading,
}: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-card bg-paper-200" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <BookOpen className="h-6 w-6 text-ink-700/25" />
        <p className="text-xs text-ink-700/50">
          No documents yet. Upload one to start asking questions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <button
        onClick={() => onSelect(null)}
        className={`w-full rounded-card px-3 py-2 text-left text-xs font-medium transition-colors ${
          activeDocumentId === null
            ? "bg-ink-900 text-paper-50"
            : "text-ink-700/60 hover:bg-paper-200"
        }`}
      >
        Search across all documents
      </button>
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          doc={doc}
          isActive={doc.id === activeDocumentId}
          onSelect={() => onSelect(doc.id)}
          onDelete={() => onDelete(doc.id)}
        />
      ))}
    </div>
  );
}
