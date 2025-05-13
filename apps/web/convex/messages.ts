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
    const all = [];
    let message = await ctx.db.query("messages").order("desc").first();
    while (message !== null) {
      all.push(message);
      message = await ctx.db
        .query("messages")
        .withIndex("by_receiverId", (q) =>
          q.lt("receiverId", message?.receiverId as Id<"users">),
        )
        .first();
    }

    const conversations = all.filter((conv) => conv.senderId === userId);

    // Get user information for each conversation
    const conversationsWithNames = await Promise.all(
      conversations.map(async (conv) => {
        const receiver = await ctx.db.get(conv.receiverId);
        return {
          ...conv,
          receiverName:
            receiver?.name ??
            receiver?.displayName ??
            receiver?.address ??
            "Unknown",
        };
      }),
    );

    return conversationsWithNames;
  },
});

// List messages in a conversation
export const listMessagesFromUserToOther = query({
  args: { receiverId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as Id<"users">;

    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("senderId"), userId),
          q.eq(q.field("receiverId"), args.receiverId),
        ),
      )
      .order("asc")
      .collect();

    // Get receiver information
    const receiver = await ctx.db.get(args.receiverId);

    return messages.map((msg) => ({
      ...msg,
      receiverName:
        receiver?.name ??
        receiver?.displayName ??
        receiver?.address ??
        "Unknown",
      senderName: identity.name ?? identity.nickname ?? "You",
    }));
  },
});

export const listMessagesFromOtherToUser = query({
  args: { receiverId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const userId = identity.subject as Id<"users">;

    const messages = await ctx.db
      .query("messages")
      .filter((q) =>
        q.and(
          q.eq(q.field("senderId"), args.receiverId),
          q.eq(q.field("receiverId"), userId),
        ),
      )
      .order("asc")
      .collect();

    // Get sender information
    const sender = await ctx.db.get(args.receiverId);

    return messages.map((msg) => ({
      ...msg,
      senderName:
        sender?.name ?? sender?.displayName ?? sender?.address ?? "Unknown",
      receiverName: identity.name ?? identity.nickname ?? "You",
    }));
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
    await ctx.db.insert("messages", {
      receiverId: args.receiverId,
      senderId: userId as Id<"users">,
      content: args.content,
    });
  },
});
