import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getComments = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();
  },
});

export const createComment = mutation({
  args: {
    postId: v.id("posts"),
    authorId: v.id("users"),
    authorAddress: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: args.authorId,
      authorAddress: args.authorAddress,
      content: args.content,
    });
  },
});
