// Thin wrapper around Vercel Blob upload — server only
import { put, del } from "@vercel/blob";
import { storagePath } from "@/lib/utils";

export async function uploadToBlob(
  file: File,
  folder: string,
): Promise<{ url: string; pathname: string }> {
  const path = storagePath(folder, file.name);
  const blob = await put(path, file, {
    access: "public",
    addRandomSuffix: false,
  });
  return { url: blob.url, pathname: blob.pathname };
}

export async function deleteFromBlob(pathname: string): Promise<void> {
  await del(pathname);
}
