import { v } from "convex/values";

import { query } from "./_generated/server";

export const getUserProfile = query({
  args: { address: v.string() },
  returns: v.union(
    v.object({
      address: v.string(),
      displayName: v.optional(v.string()),
      bio: v.optional(v.string()),
      manualStudies: v.optional(v.array(v.string())),
      manualExperience: v.optional(v.array(v.string())),
      portfolioLinks: v.optional(v.array(v.string())),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const address = args.address.toLowerCase();
    const user = await ctx.db
      .query("users")
      .withIndex("by_address", (q) => q.eq("address", address))
      .unique();
    return user;
  },
});
