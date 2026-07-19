"use client";

import { useDocuments } from "@/hooks/useDocuments";
import { useChatStore } from "@/store/chatStore";
import { DropzoneUpload } from "@/components/documents/DropzoneUpload";
import { DocumentList } from "@/components/documents/DocumentList";

export function Sidebar() {
  const { documents, isLoading, uploadingCount, upload, remove } = useDocuments();
  const { activeDocumentId, setActiveDocumentId } = useChatStore();

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-r border-paper-200 bg-paper-100/60">
      <div className="px-5 pb-4 pt-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-ink-900 font-display text-sm font-semibold text-gold-400">
            A
          </div>
          <span className="font-display text-base font-semibold text-ink-900">Archive</span>
        </div>
        <p className="mt-1 text-xs text-ink-700/50">Document-grounded chat</p>
      </div>

      <div className="px-5">
        <DropzoneUpload onUpload={upload} uploadingCount={uploadingCount} />
      </div>

      <div className="mt-6 flex-1 overflow-y-auto px-5 pb-6">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-700/40">
          Documents
        </p>
        <DocumentList
          documents={documents}
          activeDocumentId={activeDocumentId}
          onSelect={setActiveDocumentId}
          onDelete={remove}
          isLoading={isLoading}
        />
      </div>
    </aside>
  );
}
