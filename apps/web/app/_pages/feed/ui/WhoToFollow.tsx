"use client";

import { useQuery } from "convex/react";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { FollowCard, FollowCardSkeleton } from "./FollowCard";

export function WhoToFollow() {
  const otherUsers = useQuery(api.posts.getOtherUsers);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Who to follow</h2>
      </div>

      <div className="mb-6 space-y-6">
        {otherUsers === undefined ? (
          <>
            <FollowCardSkeleton />
            <FollowCardSkeleton />
          </>
        ) : (
          otherUsers.map((user) => (
            <FollowCard
              key={user._id}
              displayName={user.displayName as Id<"users">}
              followingId={user._id}
            />
          ))
        )}
      </div>
    </>
  );
}
