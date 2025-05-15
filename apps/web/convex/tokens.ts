import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const createToken = mutation({
  args: {
    tokenId: v.int64(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const token = await ctx.db.insert("tokens", {
      userId: identity.subject as Id<"users">,
      tokenId: args.tokenId,
    });
  },
});
