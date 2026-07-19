"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneUploadProps {
  onUpload: (file: File) => Promise<void>;
  uploadingCount: number;
}

export function DropzoneUpload({ onUpload, uploadingCount }: DropzoneUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      for (const file of acceptedFiles) {
        try {
          await onUpload(file);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Upload failed");
        }
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    maxSize: 20 * 1024 * 1024,
  });

  const isBusy = uploadingCount > 0;

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-card border-2 border-dashed p-5 text-center transition-colors",
          isDragActive
            ? "border-gold-500 bg-gold-500/5"
            : "border-paper-200 hover:border-ink-700/30 hover:bg-paper-100"
        )}
      >
        <input {...getInputProps()} />
        {isBusy ? (
          <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-gold-600" />
        ) : (
          <UploadCloud className="mx-auto mb-2 h-5 w-5 text-ink-700/60" />
        )}
        <p className="text-sm font-medium text-ink-800">
          {isBusy ? "Reading document…" : "Drop a file, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-ink-700/50">PDF or TXT, up to 20MB</p>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
