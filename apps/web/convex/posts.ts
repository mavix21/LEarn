import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const createPost = mutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("posts", {
      content: args.content,
      authorId: id.subject as Id<"users">,
    });
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.authorId);
        return {
          ...post,
          authorName: user?.displayName ?? "Anonymous",
        };
      }),
    );
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
  handler: async (ctx) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("_id"), id.subject as Id<"users">))
      .order("desc")
      .take(2);
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
