import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getLikes = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .filter((q) => q.eq(q.field("authorId"), id.subject as Id<"users">))
      .collect();
  },
});

export const createLikePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("likes", {
      authorId: id.subject as Id<"users">,
      postId: args.postId,
    });
  },
});

export const deleteLikePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    const like = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .filter((q) => q.eq(q.field("authorId"), id.subject as Id<"users">))
      .unique();
    if (like) {
      await ctx.db.delete(like._id);
    }
  },
});
