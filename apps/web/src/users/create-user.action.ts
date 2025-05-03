"use server";

import { fetchMutation } from "convex/nextjs";

import { api } from "@/convex/_generated/api";

export async function createUser(address: string) {
  const normalizedAddress = address.toLowerCase();

  const id = await fetchMutation(api.users.createUser, {
    address: normalizedAddress,
  });

  return id;
}
