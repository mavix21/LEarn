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
      for (const storageId of args.attachments) {
        const mediaId = await ctx.db.insert("media", {
          postId: undefined as unknown as Id<"posts">,
          storageId,
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
          attachmentsUrls = (
            await Promise.all(
              mediaDocs
                .filter(
                  (
                    media,
                  ): media is {
                    _id: Id<"media">;
                    _creationTime: number;
                    postId?: Id<"posts">;
                    type: "image" | "video";
                    storageId: string;
                  } => Boolean(media) && typeof media?.storageId === "string",
                )
                .map(
                  async (media) => await ctx.storage.getUrl(media.storageId),
                ),
            )
          ).filter(
            (url): url is string => typeof url === "string" && url.length > 0,
          );
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
  handler: async (ctx) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_authorId", (q) =>
        q.eq("authorId", id.subject as Id<"users">),
      )
      .order("desc")
      .collect();

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

export const getUsers = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getHashtagsContent = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
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

export const addMediaToPost = mutation({
  args: {
    postId: v.id("posts"),
    media: v.array(
      v.object({
        storageId: v.string(),
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
        storageId: file.storageId,
        type: file.type,
      });
    }
  },
});
