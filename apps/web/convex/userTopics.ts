import { v } from "convex/values";

import { query } from "./_generated/server";

export const getUserTopics = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_topics")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
