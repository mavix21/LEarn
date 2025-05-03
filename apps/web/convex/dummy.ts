import type { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const viewerInfo = query({
  args: {},
  handler: async (ctx) => {
    // Assuming this query is only called after authentication
    const { subject: userId } = (await ctx.auth.getUserIdentity())!;
    return await ctx.db.get(userId as Id<"users">);
  },
});
