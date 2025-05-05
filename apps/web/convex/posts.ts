import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const createPost = mutation({
  args: {
    content: v.string(),
    attachments: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }
    const mediaIds: Id<"media">[] = [];
    if (args.attachments && args.attachments.length > 0) {
      for (const url of args.attachments) {
        const mediaId = await ctx.db.insert("media", {
          // postId will be set after post is created
          postId: undefined as unknown as Id<"posts">,
          url,
          type: "image",
        });
        mediaIds.push(mediaId);
      }
    }
    const postId = await ctx.db.insert("posts", {
      content: args.content,
      authorId: id.subject as Id<"users">,
      attachments: mediaIds.length > 0 ? mediaIds : undefined,
    });
    // Patch media records with the correct postId
    for (const mediaId of mediaIds) {
      await ctx.db.patch(mediaId, { postId });
    }
  },
});

export const getPosts = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.authorId);
        let attachmentsUrls: string[] = [];
        if (
          post.attachments &&
          Array.isArray(post.attachments) &&
          post.attachments.length > 0
        ) {
          const mediaDocs = await Promise.all(
            post.attachments.map((mediaId) => ctx.db.get(mediaId)),
          );
          attachmentsUrls = mediaDocs
            .filter(Boolean)
            .map((media) => media!.url);
        }
        return {
          ...post,
          authorName: user?.displayName ?? "Anonymous",
          attachmentsUrls,
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

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const addMediaToPost = mutation({
  args: {
    postId: v.id("posts"),
    media: v.array(
      v.object({
        url: v.string(),
        type: v.union(v.literal("image"), v.literal("video")),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }
    for (const file of args.media) {
      await ctx.db.insert("media", {
        postId: args.postId,
        url: file.url,
        type: file.type,
      });
    }
  },
});
