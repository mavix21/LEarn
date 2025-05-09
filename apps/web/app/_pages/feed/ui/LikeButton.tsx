"use client";

import { useMutation, useQuery } from "convex/react";
import { Heart } from "lucide-react";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface LikeButtonProps {
  postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const getLikes = useQuery(api.likes.getLikes, {
    postId: postId as Id<"posts">,
  });

  const createLike = useMutation(api.likes.createLikePost).withOptimisticUpdate(
    (localStore, args) => {
      // Optimistically update the likes query
      const currentLikes = localStore.getQuery(api.likes.getLikes, {
        postId: args.postId,
      });
      if (currentLikes !== undefined) {
        localStore.setQuery(api.likes.getLikes, { postId: args.postId }, [
          ...currentLikes,
          {
            _id: "temp" as Id<"likes">,
            _creationTime: Date.now(),
            postId: args.postId,
            authorId: "temp" as Id<"users">,
          },
        ]);
      }
    },
  );

  const deleteLike = useMutation(api.likes.deleteLikePost).withOptimisticUpdate(
    (localStore, args) => {
      // Optimistically update the likes query
      const currentLikes = localStore.getQuery(api.likes.getLikes, {
        postId: args.postId,
      });
      if (currentLikes !== undefined) {
        localStore.setQuery(api.likes.getLikes, { postId: args.postId }, []);
      }
    },
  );

  const isLiked = getLikes !== undefined && getLikes.length > 0;

  const handleLike = async () => {
    if (isLiked) {
      await deleteLike({ postId: postId as Id<"posts"> });
    } else {
      await createLike({ postId: postId as Id<"posts"> });
    }
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center transition-colors hover:text-red-500"
      disabled={getLikes === undefined}
    >
      <Heart
        size={20}
        className={`${
          isLiked ? "fill-red-500 text-red-500" : "text-muted-foreground"
        }`}
      />
    </button>
  );
}
