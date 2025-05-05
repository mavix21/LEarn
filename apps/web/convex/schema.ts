import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { authTables } from "./authTables";

export default defineSchema({
  ...authTables,

  connections: defineTable({
    requesterId: v.id("users"),
    recipientId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("connected"),
      v.literal("rejected"),
    ),
  })
    .index("by_requesterId", ["requesterId"])
    .index("by_recipientId", ["recipientId"])
    .index("by_status", ["status"]), // for status views

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_followerId", ["followerId"])
    .index("by_followingId", ["followingId"]),

  posts: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    attachments: v.optional(v.array(v.id("media"))),
    likes: v.optional(v.id("likes")),
    bookmarks: v.optional(v.id("bookmarks")),
    comments: v.optional(v.id("comments")),
    likedNotifications: v.optional(v.id("notifications")),
  })
    .searchIndex("search_post", {
      searchField: "content",
    })
    .index("by_authorId", ["authorId"]),

  media: defineTable({
    postId: v.id("posts"),
    url: v.string(),
    type: v.union(v.literal("image"), v.literal("video")),
  }),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_authorId", ["authorId"]),

  likes: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_authorId", ["authorId"]),

  bookmarks: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_userId", ["userId"]),

  notifications: defineTable({
    recipientId: v.id("users"),
    issuerId: v.id("users"),
    postId: v.id("posts"),
    type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
    read: v.boolean(),
  })
    .index("by_postId", ["postId"])
    .index("by_recipientId", ["recipientId"])
    .index("by_issuerId", ["issuerId"]),

  user_topics: defineTable({
    userId: v.id("users"),
    topic: v.string(),
    endorsements: v.optional(v.number()),
  }).index("userId", ["userId"]),
});
