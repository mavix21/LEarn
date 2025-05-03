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
    return ctx.db.query("posts").order("desc").collect();
  },
});

export const getPostsByAuthorId = query({
  args: {
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_authorId", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();
  },
});

export const getOtherUsers = query({
  args: {
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("_id"), args.authorId))
      .collect();
  },
});

export const getHashtagsContent = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx, args) => {
    // Get all posts (optionally, you can use a search index for performance)
    const posts = await ctx.db
      .query("posts")
      .withSearchIndex("search_post", (q) => q.search("content", "#"))
      .collect();

    // Extract hashtags from each post's content
    const hashtags = posts.flatMap(
      (post) => post.content.match(/#[\w]+/g) ?? [],
    );

    return hashtags;
  },
});
