import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    address: v.string(), // always store in lowercase
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    manualStudies: v.optional(v.array(v.string())),
    manualExperience: v.optional(v.array(v.string())),
    portfolioLinks: v.optional(v.array(v.string())),
  }).index("by_address", ["address"]),

  connections: defineTable({
    requesterAddress: v.string(),
    recipientAddress: v.string(),
    requesterId: v.id("users"),
    recipientId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("connected"),
      v.literal("rejected"),
    ),
  })
    .index("by_requester", ["requesterAddress"]) // for outgoing
    .index("by_recipient", ["recipientAddress"]) // for incoming
    .index("by_requesterId", ["requesterId"])
    .index("by_recipientId", ["recipientId"])
    .index("by_status", ["status"]) // for status views
    .index("by_requester_and_status", ["requesterAddress", "status"]) // for compound queries
    .index("by_recipient_and_status", ["recipientAddress", "status"]),

  follows: defineTable({
    followerAddress: v.string(),
    followingAddress: v.string(),
    followerId: v.id("users"),
    followingId: v.id("users"),
  })
    .index("by_followerAddress", ["followerAddress"])
    .index("by_followingAddress", ["followingAddress"])
    .index("by_followerId", ["followerId"])
    .index("by_followingId", ["followingId"]),

  posts: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    authorAddress: v.string(),
    attachments: v.optional(v.id("media")),
    likes: v.optional(v.id("likes")),
    bookmarks: v.optional(v.id("bookmarks")),
    comments: v.optional(v.id("comments")),
    likedNotifications: v.optional(v.id("notifications")),
  })
    .searchIndex("search_post", {
      searchField: "content",
    })
    .index("by_authorAddress", ["authorAddress"])
    .index("by_authorId", ["authorId"]),

  media: defineTable({
    postId: v.id("posts"),
    url: v.string(),
    type: v.union(v.literal("image"), v.literal("video")),
  }),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    authorAddress: v.string(),
    content: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_authorId", ["authorId"])
    .index("by_authorAddress", ["authorAddress"]),

  likes: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    authorAddress: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_authorId", ["authorId"])
    .index("by_authorAddress", ["authorAddress"]),

  bookmarks: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
    userAddress: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_userId", ["userId"])
    .index("by_userAddress", ["userAddress"]),

  notifications: defineTable({
    recipientId: v.id("users"),
    recipientAddress: v.string(),
    issuerId: v.id("users"),
    issuerAddress: v.string(),
    postId: v.id("posts"),
    type: v.union(v.literal("like"), v.literal("comment"), v.literal("follow")),
    read: v.boolean(),
  })
    .index("by_recipientAddress", ["recipientAddress"])
    .index("by_issuerAddress", ["issuerAddress"])
    .index("by_postId", ["postId"])
    .index("by_recipientId", ["recipientId"])
    .index("by_issuerId", ["issuerId"]),
});
