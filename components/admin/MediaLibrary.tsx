"use client";

import { useState } from "react";
import { MediaAsset } from "@/types";
import { bytesToHuman, formatDate } from "@/lib/utils";
import { FileUpload } from "./FileUpload";
import { toast } from "sonner";

export function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function handleUpload(asset: MediaAsset) {
    setAssets((prev) => [asset, ...prev]);
    toast.success("File uploaded to Firebase Storage.");
  }

  async function handleDelete(asset: MediaAsset) {
    if (!confirm(`Delete "${asset.name}"? This will also remove it from Firebase Storage.`)) return;
    setDeleting(asset.id);
    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      toast.success("Asset deleted from Storage and Firestore.");
    } catch {
      toast.error("Failed to delete asset.");
    } finally {
      setDeleting(null);
    }
  }

  async function copyUrl(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    toast.success("URL copied to clipboard.");
    setTimeout(() => setCopied(null), 2000);
  }

  const images = assets.filter((a) => a.mimeType.startsWith("image/"));
  const others = assets.filter((a) => !a.mimeType.startsWith("image/"));

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <p className="text-white-100 text-sm mt-1">
          {assets.length} assets · stored in Firebase Storage · copy URLs to use in projects and experience
        </p>
      </div>

      {/* Upload zone */}
      <div className="mb-10">
        <FileUpload
          folder="uploads"
          accept={{
            "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"],
            "application/pdf": [".pdf"],
            "video/mp4": [".mp4"],
            "video/webm": [".webm"],
          }}
          maxSizeMB={50}
          onUpload={handleUpload}
          label="Drag files here or click to browse (images, PDFs, videos · max 50 MB)"
        />
      </div>

      {assets.length === 0 && (
        <div className="text-center py-16 text-white-200 border border-dashed border-black-300 rounded-2xl">
          No assets yet. Upload your first file above.
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-mono text-purple uppercase tracking-widest mb-4">
            Images ({images.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((asset) => (
              <div
                key={asset.id}
                className="group relative bg-black-200 border border-black-300 rounded-xl overflow-hidden hover:border-purple/30 transition-colors"
              >
                <div className="relative aspect-square">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => copyUrl(asset.url, asset.id)}
                      className="w-full px-2 py-1.5 rounded-lg bg-purple/80 hover:bg-purple text-black-100 text-xs font-semibold transition-colors"
                    >
                      {copied === asset.id ? "Copied!" : "Copy URL"}
                    </button>
                    <button
                      onClick={() => handleDelete(asset)}
                      disabled={deleting === asset.id}
                      className="w-full px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs transition-colors disabled:opacity-40"
                    >
                      {deleting === asset.id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-white-100 truncate">{asset.name}</p>
                  <p className="text-xs text-white-200">{bytesToHuman(asset.sizeBytes)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other files */}
      {others.length > 0 && (
        <div>
          <h2 className="text-xs font-mono text-purple uppercase tracking-widest mb-4">
            Other files ({others.length})
          </h2>
          <div className="space-y-2">
            {others.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center gap-4 bg-black-200 border border-black-300 rounded-xl p-4 hover:border-purple/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-black-100 flex items-center justify-center text-lg shrink-0">
                  {asset.mimeType === "application/pdf" ? "📄" : "🎬"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{asset.name}</p>
                  <p className="text-xs text-white-200">
                    {bytesToHuman(asset.sizeBytes)} · {formatDate(asset.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyUrl(asset.url, asset.id)}
                    className="px-3 py-1.5 rounded-lg text-xs text-white-100 hover:text-white hover:bg-black-100 transition-all"
                  >
                    {copied === asset.id ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(asset)}
                    disabled={deleting === asset.id}
                    className="px-3 py-1.5 rounded-lg text-xs text-white-200 hover:text-red-400 hover:bg-red-400/5 transition-all disabled:opacity-40"
                  >
                    {deleting === asset.id ? "…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
