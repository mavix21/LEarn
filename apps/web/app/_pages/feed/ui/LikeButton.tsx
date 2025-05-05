"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Heart } from "lucide-react";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface LikeButtonProps {
  postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const createLike = useMutation(api.likes.createLikePost);
  const deleteLike = useMutation(api.likes.deleteLikePost);
  const getLikes = useQuery(api.likes.getLikes, {
    authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
    postId: postId as Id<"posts">,
  });

  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);

  const handleLike = async () => {
    if (isLiked === undefined) return;
    if (!isLiked) {
      setIsLiked(true);
      createLike({
        postId: postId as Id<"posts">,
        authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
        authorAddress: "0x4029490B2Dedd37906F2911B444d081caAad8E71",
      }).catch((error) => {
        setIsLiked(false);
        console.error("Failed to create like:", error);
      });
    } else {
      setIsLiked(false);
      deleteLike({
        postId: postId as Id<"posts">,
        authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
      }).catch((error) => {
        setIsLiked(true);
        console.error("Failed to delete like:", error);
      });
    }
  };

  useEffect(() => {
    if (getLikes !== undefined) {
      setIsLiked(getLikes.length > 0);
    }
  }, [getLikes]);

  return (
    <button
      onClick={handleLike}
      className="flex items-center transition-colors hover:text-red-500"
      disabled={isLiked === undefined}
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
