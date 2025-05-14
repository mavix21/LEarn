"use server";

import { fetchMutation } from "convex/nextjs";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export async function uploadFile(file: File) {
  const uploadUrl = await fetchMutation(api.storage.generateUploadUrl);
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await res.json();

  const storageId = response.storageId as Id<"_storage">;
  // Return the storage ID (not a URL)
  return { storageId, uploadUrl };
}
