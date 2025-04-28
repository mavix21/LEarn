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
    status: v.string(), // 'pending', 'connected', 'rejected'
  })
    .index("by_requester", ["requesterAddress"]) // for outgoing
    .index("by_recipient", ["recipientAddress"]) // for incoming
    .index("by_status", ["status"]) // for status views
    .index("by_requester_and_status", ["requesterAddress", "status"]) // for compound queries
    .index("by_recipient_and_status", ["recipientAddress", "status"]),
});
