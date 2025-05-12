import { useMutation, useQuery } from "convex/react";

import { Button } from "@skill-based/ui/components/button";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface FollowButtonProps {
  followingId: string;
}

export function FollowButton({ followingId }: FollowButtonProps) {
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
      className={
        isFollowing
          ? "hover:bg-destructive/10 hover:text-destructive"
          : "bg-primary hover:bg-primary/80"
      }
      onClick={handleFollow}
      disabled={getFollows === undefined}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
