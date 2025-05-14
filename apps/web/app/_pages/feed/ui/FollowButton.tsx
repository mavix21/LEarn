"use client";

import { useMutation, useQuery } from "convex/react";

import { Button } from "@skill-based/ui/components/button";
import { cn } from "@skill-based/ui/lib/utils";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface FollowButtonProps {
  followingId: string;
  className?: string;
}

export function FollowButton({ followingId, className }: FollowButtonProps) {
  const getFollows = useQuery(api.follows.getFollow, {
    followingId: followingId as Id<"users">,
  });

  const createFollow = useMutation(
    api.follows.createFollow,
  ).withOptimisticUpdate((localStore, args) => {
    const currentFollows = localStore.getQuery(api.follows.getFollow, {
      followingId: args.followingId,
    });
    if (currentFollows !== undefined) {
      localStore.setQuery(
        api.follows.getFollow,
        { followingId: args.followingId },
        {
          _id: "temp" as Id<"follows">,
          _creationTime: Date.now(),
          followerId: "temp" as Id<"users">,
          followingId: args.followingId,
        },
      );
    }
  });

  const deleteFollow = useMutation(
    api.follows.deleteFollow,
  ).withOptimisticUpdate((localStore, args) => {
    const currentFollows = localStore.getQuery(api.follows.getFollow, {
      followingId: args.followingId,
    });
    if (currentFollows !== undefined) {
      localStore.setQuery(
        api.follows.getFollow,
        {
          followingId: args.followingId,
        },
        null,
      );
    }
  });

  const isFollowing = getFollows !== undefined && getFollows !== null;

  const handleFollow = async () => {
    if (isFollowing) {
      await deleteFollow({ followingId: followingId as Id<"users"> });
    } else {
      await createFollow({ followingId: followingId as Id<"users"> });
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className={cn(
        isFollowing
          ? "hover:bg-background/90 hover:text-foreground"
          : "bg-primary hover:bg-primary/80",
        className,
      )}
      onClick={handleFollow}
      disabled={getFollows === undefined}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
