import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const createLikePost = mutation({
  args: {
    authorAddress: v.string(),
    authorId: v.id("users"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("likes", {
      authorAddress: args.authorAddress,
      authorId: args.authorId,
      postId: args.postId,
    });
  },
});

export const deleteLikePost = mutation({
  args: {
    likeId: v.id("likes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.likeId);
  },
});
