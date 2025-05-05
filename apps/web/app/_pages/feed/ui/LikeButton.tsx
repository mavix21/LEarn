"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { Heart } from "lucide-react";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface LikeButtonProps {
  postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const createLike = useMutation(api.likes.createLikePost);
  const deleteLike = useMutation(api.likes.deleteLikePost);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    if (!isLiked) {
      createLike({
        postId: postId as Id<"posts">,
        authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
        authorAddress: "0x4029490B2Dedd37906F2911B444d081caAad8E71",
      }).catch((error) => {
        console.error("Failed to create like:", error);
      });
    } else {
      deleteLike({
        postId: postId as Id<"posts">,
        authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
      }).catch((error) => {
        console.error("Failed to delete like:", error);
      });
    }
  };

  return (
    <button
      // onClick={() => console.log("like or dislike")}
      onClick={handleLike}
      className="flex items-center transition-colors hover:text-red-500"
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
