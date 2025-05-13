"use server";

import { fetchMutation } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

export async function uploadFile(file: File): Promise<string> {
  const uploadUrl = await fetchMutation(api.storage.generateUploadUrl);
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { storageId } = await res.json();
  // Return the storage ID (not a URL)
  return storageId as string;
}
