import { ConvexError, v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("address"), args.address))
      .first();

    if (user) {
      return user._id;
    }

    const userId = await ctx.db.insert("users", {
      address: args.address,
    });

    await ctx.db.insert("userProfiles", {
      userId,
      hobbies: [],
    });

    return userId;
  },
});

export const exists = query({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("address"), args.address))
      .first();

    return !!user;
  },
});

export const getUser = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    return {
      name: user.displayName ?? user.address,
      title: user.title ?? "",
      location: user.location ?? "",
      avatarUrl: user.avatarUrl ?? user.image ?? "",
      bio: user.bio ?? "",
    };
  },
});

export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError({
        message: "User not found",
      });
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    const coverImageUrl =
      (user.coverImageStorageId
        ? await ctx.storage.getUrl(user.coverImageStorageId)
        : null) ?? undefined;

    return {
      userId: user._id,
      name: user.displayName ?? user.address,
      title: user.title ?? "",
      address: user.address as `0x${string}`,
      location: user.location ?? "",
      avatarUrl: user.avatarUrl ?? user.image ?? "",
      coverImageStorageId: user.coverImageStorageId,
      coverImageUrl,
      bio: user.bio ?? "",
      hobbies: userProfile?.hobbies ?? [],
      isMe: user._id === id.subject,
    };
  },
});

export const updateDisplayName = mutation({
  args: {
    userId: v.id("users"),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return;
    }

    await ctx.db.patch(args.userId, {
      displayName: args.displayName,
    });
  },
});

export const updateCoverImage = mutation({
  args: {
    coverImageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id.subject as Id<"users">, {
      coverImageStorageId: args.coverImageStorageId,
    });
  },
});

export const updateBio = mutation({
  args: {
    bio: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(id.subject as Id<"users">, {
      bio: args.bio,
    });
  },
});

export const updateHobbies = mutation({
  args: {
    hobbies: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    const userProfile = await ctx.db
      .query("userProfiles")
      .filter((q) => q.eq(q.field("userId"), id.subject as Id<"users">))
      .first();

    if (!userProfile) {
      throw new ConvexError({
        message: "User profile not found",
      });
    }

    await ctx.db.patch(userProfile._id, {
      hobbies: args.hobbies,
    });
  },
});
