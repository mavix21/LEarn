import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("address"), args.address))
      .first();

    if (user) {
      return user._id;
    }

    return await ctx.db.insert("users", {
      address: args.address,
    });
  },
});

export const exists = query({
  args: {
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("address"), args.address))
      .first();

    return !!user;
  },
});
