import { v } from "convex/values";

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

    return await ctx.db.insert("users", {
      address: args.address,
    });
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
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      return null;
    }

    return {
      name: user.name ?? user.displayName ?? user.address,
      title: user.title ?? "",
      location: user.location ?? "",
      avatarUrl: user.avatarUrl ?? user.image ?? "",
      bio: user.bio ?? "",
      isMe: user._id === id.subject,
    };
  },
});

export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const userTopics = await ctx.db
      .query("user_topics")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    return {
      name: user?.name ?? user?.displayName ?? user?.address ?? "",
      title: user?.title ?? "",
      location: user?.location ?? "",
      avatarUrl: user?.avatarUrl ?? user?.image ?? "",
      bio: user?.bio ?? "",
      topics: userTopics.map(({ endorsements, topic }) => ({
        topic,
        endorsements: endorsements ?? 0,
      })),
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
