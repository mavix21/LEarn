"use client";

import { useState } from "react";
import Image from "next/image";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Heart, MoreHorizontal, Repeat2, User } from "lucide-react";

import { formatRelativeDate } from "@skill-based/ui/lib/dates";

import type { Id } from "@/convex/_generated/dataModel";
import { useAuthGateDialog } from "@/app/_shared/ui/auth-gate-dialog-context";
import { api } from "@/convex/_generated/api";

import { CommentInput } from "./CommentInput";
import { CommentSection } from "./CommentSection";
import { CommentsList } from "./CommentsList";
import { LikeButton } from "./LikeButton";

interface PostProps {
  postId: string;
  authorName: string;
  content: string;
  creationTime: number;
  attachmentsUrls?: string[];
}

export function Post({
  postId,
  authorName,
  content,
  creationTime,
  attachmentsUrls = [],
}: PostProps) {
  const { isAuthenticated } = useConvexAuth();
  const [showInput, setShowInput] = useState(false);
  const { open } = useAuthGateDialog();

  const createComment = useMutation(api.comments.createComment);

  const comments = useQuery(api.comments.getComments, {
    postId: postId as Id<"posts">,
  });

  // Fetch like and comment counts
  const likesCount = useQuery(api.likes.getLikesCount, {
    postId: postId as Id<"posts">,
  });
  const commentsCount = useQuery(api.comments.getCommentsCount, {
    postId: postId as Id<"posts">,
  });

  async function onSend(value: string, postId: string) {
    await createComment({
      postId: postId as Id<"posts">,
      content: value,
    });
  }

  return (
    <div className="bg-background mb-2 rounded-xl p-4 shadow-md">
      <div className="flex items-start gap-3">
        <div className="relative">
          <User className="text-muted-foreground" size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <span className="font-medium">{authorName}</span>
              <span className="text-muted-foreground ml-2 text-sm">
                {formatRelativeDate(creationTime)}
              </span>
            </div>
            <MoreHorizontal size={20} className="text-muted-foreground" />
          </div>
          <p className="mt-1 whitespace-pre-line break-words">{content}</p>
          {/* Images display */}
          {attachmentsUrls.length === 1 && attachmentsUrls[0] && (
            <div className="my-4 flex justify-center">
              <Image
                src={attachmentsUrls[0]}
                alt="Post attachment"
                width={320}
                height={320}
                className="max-h-80 rounded object-cover"
              />
            </div>
          )}
          {attachmentsUrls.length === 2 &&
            attachmentsUrls.every((url) => !!url) && (
              <div className="my-4 grid grid-cols-2 gap-2">
                {attachmentsUrls.map((url, idx) => (
                  <Image
                    key={idx}
                    src={url}
                    alt={`Post attachment ${idx + 1}`}
                    width={200}
                    height={200}
                    className="max-h-80 w-full rounded object-cover"
                  />
                ))}
              </div>
            )}
          <div className="mt-4 flex items-center gap-4">
            {isAuthenticated ? (
              <LikeButton postId={postId} />
            ) : (
              <button
                className="flex items-center transition-colors hover:text-red-500"
                onClick={() => {
                  open({ key: "like" });
                }}
              >
                <Heart
                  size={20}
                  className="text-muted-foreground transition-transform duration-300 hover:scale-105"
                />
              </button>
            )}
            <CommentSection
              postId={postId}
              showInput={showInput}
              handleInput={(e) => {
                if (isAuthenticated) {
                  setShowInput(e);
                } else {
                  open({ key: "comment" });
                }
              }}
            />
            <Repeat2 size={20} className="text-muted-foreground" />
            {/* <Triangle size={20} className="text-muted-foreground" /> */}
          </div>
          {showInput && (
            <CommentInput
              onSend={(value) => onSend(value, postId)}
              postId={postId}
            />
          )}
          {comments && <CommentsList postId={postId} />}
          <div className="text-muted-foreground mt-2 flex items-center text-sm">
            <span>
              {likesCount ?? "-"} Me gusta · {commentsCount ?? "-"} {commentsCount === 1 ? "comentario" : "comentarios"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
