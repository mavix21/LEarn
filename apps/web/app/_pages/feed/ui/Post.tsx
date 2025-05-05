"use client";

import { useState } from "react";
import { MoreHorizontal, Repeat2, Triangle, User } from "lucide-react";

import { formatRelativeDate } from "@skill-based/ui/lib/dates";

import { CommentInput, CommentSection } from "./CommentSection";
import { LikeButton } from "./LikeButton";

interface PostProps {
  postId: string;
  authorName: string;
  content: string;
  creationTime: number;
}

export function Post({ postId, authorName, content, creationTime }: PostProps) {
  const [showInput, setShowInput] = useState(false);
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
          <div className="mt-4 flex items-center gap-4">
            <LikeButton postId={postId} />
            <CommentSection
              postId={postId}
              showInput={showInput}
              setShowInput={setShowInput}
            />
            <Repeat2 size={20} className="text-muted-foreground" />
            <Triangle size={20} className="text-muted-foreground" />
          </div>
          {showInput && <CommentInput />}
          <div className="text-muted-foreground mt-2 flex items-center text-sm">
            <span>7 respostas · 59 curtidas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
