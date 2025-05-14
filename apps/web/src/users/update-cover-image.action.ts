"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fetchMutation } from "convex/nextjs";

import type { Id } from "@/convex/_generated/dataModel";
import { auth } from "@/auth";
import { api } from "@/convex/_generated/api";

export async function updateCoverImage(coverImageStorageId: Id<"_storage">) {
  const session = await auth();
  if (!session) {
    redirect("/feed");
  }
  const { convexToken } = session;
  await fetchMutation(
    api.users.updateCoverImage,
    {
      coverImageStorageId,
    },
    { token: convexToken },
  );

  revalidatePath("/profile/[userId]");
}
