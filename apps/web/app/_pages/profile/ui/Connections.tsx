"use client";

import { use } from "react";
import { useQuery } from "convex/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@skill-based/ui/components/avatar";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { ConnectionCard, ConnectionCardSkeleton } from "./ConnectionCard";

export default function Connections({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const followers = useQuery(api.follows.getFollowers, {
    followingId: userId as Id<"users">,
  });
  console.log(followers);
  return (
    <div className="bg-card mb-6 rounded-xl border p-4">
      <h2 className="mb-4 text-lg font-semibold">Followers</h2>
      <div className="space-y-4">
        {followers === undefined ? (
          <>
            <ConnectionCardSkeleton />
            <ConnectionCardSkeleton />
          </>
        ) : (
          followers.map((follower) => (
            <ConnectionCard
              displayName={follower.followerName}
              followingId={follower.followerId}
            />
          ))
        )}
      </div>
    </div>
  );
}
