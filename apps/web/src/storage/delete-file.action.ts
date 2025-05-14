"use server";

import { redirect } from "next/navigation";
import { fetchMutation } from "convex/nextjs";

import type { Id } from "@/convex/_generated/dataModel";
import { auth } from "@/auth";
import { api } from "@/convex/_generated/api";

export async function deleteFile(storageId: Id<"_storage">) {
  const session = await auth();
  if (!session) {
    redirect("/feed");
  }
  const { convexToken } = session;
  await fetchMutation(
    api.storage.deleteById,
    { storageId },
    { token: convexToken },
  );
}
