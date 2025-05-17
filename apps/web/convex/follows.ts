import { v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getFollow = query({
  args: {
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followerId"), id.subject as Id<"users">))
      .filter((q) => q.eq(q.field("followingId"), args.followingId))
      .unique();
  },
});

export const getFollowers = query({
  args: {
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const followers = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), args.followingId))
      .order("desc")
      .take(2);

    return Promise.all(
      followers.map(async (follower) => {
        const user = await ctx.db.get(follower.followerId);
        return {
          ...follower,
          followerName: user?.displayName ?? "Anonymous",
        };
      }),
    );
  },
});

export const getFollowing = query({
  args: {
    followerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    const following = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followerId"), args.followerId))
      .order("desc")
      .take(2);

    return Promise.all(
      following.map(async (f) => {
        const user = await ctx.db.get(f.followingId);
        return {
          ...f,
          followingName: user?.displayName ?? "Anonymous",
        };
      }),
    );
  },
});

export const createFollow = mutation({
  args: {
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.insert("follows", {
      followerId: id.subject as Id<"users">,
      followingId: args.followingId,
    });
  },
});

export const deleteFollow = mutation({
  args: {
    followingId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.auth.getUserIdentity();
    if (!id) {
      throw new Error("Unauthorized");
    }

    const follow = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followerId"), id.subject as Id<"users">))
      .filter((q) => q.eq(q.field("followingId"), args.followingId))
      .unique();

    if (follow) {
      await ctx.db.delete(follow._id);
    }
  },
});

export const getFollowersCount = query({
  args: {
    followingId: v.id("users"),
  },
  returns: v.number(),
  handler: async (ctx, args) => {
    const count = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), args.followingId))
      .collect();
    return count.length;
  },
});
