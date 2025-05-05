import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getLikes = query({
  args: {
    postId: v.id("posts"),
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();
  },
});

export const createLikePost = mutation({
  args: {
    authorId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("likes", {
      authorId: args.authorId,
      postId: args.postId,
    });
  },
});

export const deleteLikePost = mutation({
  args: {
    postId: v.id("posts"),
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const like = await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .unique();
    if (like) {
      await ctx.db.delete(like._id);
    }
  },
});
