import { v } from "convex/values";

import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), postId: v.id("posts") },
  handler: async (ctx, args) => {
    await ctx.db.insert("media", {
      storageId: args.storageId,
      postId: args.postId,
      //   author: args.author,
      type: "image",
    });
  },
});
