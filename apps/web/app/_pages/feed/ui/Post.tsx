"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { MoreHorizontal, Repeat2, Triangle, User } from "lucide-react";
import Image from "next/image";

import { formatRelativeDate } from "@skill-based/ui/lib/dates";

import type { Id } from "@/convex/_generated/dataModel";
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

export function Post({ postId, authorName, content, creationTime, attachmentsUrls = [] }: PostProps) {
  const [showInput, setShowInput] = useState(false);

  const createComment = useMutation(api.comments.createComment);

  const comments = useQuery(api.comments.getComments, {
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
          {attachmentsUrls.length === 1 && (
            <div className="flex justify-center my-4">
              <Image
                src={attachmentsUrls[0] ?? ""}
                alt="Post attachment"
                width={320}
                height={320}
                className="rounded object-cover max-h-80"
              />
            </div>
          )}
          {attachmentsUrls.length === 2 && (
            <div className="grid grid-cols-2 gap-2 my-4">
              {attachmentsUrls.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`Post attachment ${idx + 1}`}
                  width={200}
                  height={200}
                  className="rounded object-cover max-h-80 w-full"
                />
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-4">
            <LikeButton postId={postId} />
            <CommentSection
              postId={postId}
              showInput={showInput}
              handleInput={setShowInput}
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
            <span>7 Me gusta · 59 comentarios</span>
          </div>
        </div>
      </div>
    </div>
  );
}
