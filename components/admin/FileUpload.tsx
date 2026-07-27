"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn, bytesToHuman } from "@/lib/utils";
import { MediaAsset } from "@/types";
import { toast } from "sonner";

interface FileUploadProps {
  folder?: string;
  accept?: Record<string, string[]>;
  maxSizeMB?: number;
  onUpload: (asset: MediaAsset) => void;
  label?: string;
}

export function FileUpload({
  folder = "uploads",
  accept = {
    "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
  },
  maxSizeMB = 50,
  onUpload,
  label = "Drag an image here, or click to browse",
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);

  const onDrop = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setUploading(true);

      for (const file of files) {
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`${file.name} exceeds the ${maxSizeMB} MB limit.`);
          continue;
        }

        setProgress(`Uploading ${file.name}…`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Upload failed");
          toast.success(`${file.name} uploaded.`);
          onUpload(data.data as MediaAsset);
        } catch (err) {
          toast.error(`Failed: ${(err as Error).message}`);
        }
      }

      setUploading(false);
      setProgress(null);
    },
    [folder, maxSizeMB, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled: uploading,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200",
        isDragActive
          ? "border-purple bg-purple/10"
          : "border-black-300 hover:border-purple/50 hover:bg-black-200",
        uploading && "opacity-60 cursor-not-allowed pointer-events-none"
      )}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="space-y-3">
          <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-white-100">{progress}</p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-2xl text-white-200">↑</p>
          <p className="text-sm font-medium text-white-100">
            {isDragActive ? "Drop to upload" : label}
          </p>
          <p className="text-xs text-white-200">Max {maxSizeMB} MB</p>
        </div>
      )}
    </div>
  );
}
