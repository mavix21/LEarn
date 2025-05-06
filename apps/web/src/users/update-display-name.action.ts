"use server";

import { fetchMutation } from "convex/nextjs";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export async function updateDisplayName({
  userId,
  displayName,
}: {
  userId: Id<"users">;
  displayName: string;
}) {
  await fetchMutation(api.users.updateDisplayName, { userId, displayName });
}
