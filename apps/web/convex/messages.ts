import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// List conversations for current user
export const listConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as Id<"users">;
    const all = await ctx.db.query("messages").order("desc").collect();
    return all.filter((conv) => conv.senderId === userId);
  },
});

// List messages in a conversation
export const listMessagesFromUserToOther = query({
  args: { receiverId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as Id<"users">;

    return await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("senderId"), userId),
          q.eq(q.field("receiverId"), args.receiverId),
        ),
      )
      .order("asc")
      .collect();
  },
});

export const listMessagesFromOtherToUser = query({
  args: { receiverId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as Id<"users">;

    return await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("senderId"), args.receiverId),
          q.eq(q.field("receiverId"), userId),
        ),
      )
      .order("asc")
      .collect();
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    receiverId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject;
    const now = Date.now();
    await ctx.db.insert("messages", {
      receiverId: args.receiverId,
      senderId: userId as Id<"users">,
      content: args.content,
    });
  },
});
