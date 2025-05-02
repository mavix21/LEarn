import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createPost = mutation({
  args: {
    content: v.string(),
    authorId: v.id("users"),
    authorAddress: v.string(),
    // attachments: v.optional(v.id("media")),
    // likes: v.optional(v.id("likes")),
    // bookmarks: v.optional(v.id("bookmarks")),
    // comments: v.optional(v.id("comments")),
    // likedNotifications: v.optional(v.id("notifications")),
    // createdAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // const postData = {
    //   content: args.content,
    //   authorId: args.authorId,
    //   authorAddress: args.authorAddress,
    // };

    // if (args.attachments !== undefined) {
    //   postData.attachments = args.attachments;
    // }

    await ctx.db.insert("posts", {
      content: args.content,
      authorId: args.authorId,
      authorAddress: args.authorAddress,
      // attachments: args.attachments,
      // likes: args.likes,
      // bookmarks: args.bookmarks,
      // comments: args.comments,
      // likedNotifications: args.likedNotifications,
      // createdAt: args.createdAt ?? 0,
    });
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    return ctx.db.query("posts").collect();
  },
});
