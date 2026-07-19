import { useCallback, useEffect, useState } from "react";
import { fetchDocuments, uploadDocument, deleteDocument } from "@/lib/api";
import { DocumentItem } from "@/lib/types";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingCount, setUploadingCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch {
      // Swallow — the sidebar shows an empty state either way.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(
    async (file: File) => {
      setUploadingCount((c) => c + 1);
      try {
        await uploadDocument(file);
        await refresh();
      } finally {
        setUploadingCount((c) => c - 1);
      }
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      setDocuments((docs) => docs.filter((d) => d.id !== id));
      await deleteDocument(id);
    },
    []
  );

  return { documents, isLoading, uploadingCount, upload, remove, refresh };
}
