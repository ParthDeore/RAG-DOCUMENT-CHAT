"use client";

import { FileText, X } from "lucide-react";
import { DocumentItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DocumentCardProps {
  doc: DocumentItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function DocumentCard({ doc, isActive, onSelect, onDelete }: DocumentCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative cursor-pointer rounded-card border px-3 py-2.5 transition-colors",
        isActive
          ? "border-gold-500 bg-gold-500/8"
          : "border-transparent bg-paper-100 hover:bg-paper-200"
      )}
    >
      <div className="flex items-start gap-2.5">
        <FileText
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0",
            isActive ? "text-gold-600" : "text-ink-700/50"
          )}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink-900">{doc.file_name}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge status={doc.status}>{doc.status}</Badge>
            {doc.file_size_bytes && (
              <span className="text-[11px] text-ink-700/40">{formatSize(doc.file_size_bytes)}</span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Remove ${doc.file_name}`}
          className="rounded p-1 text-ink-700/30 opacity-0 transition-opacity hover:bg-paper-200 hover:text-red-600 group-hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
