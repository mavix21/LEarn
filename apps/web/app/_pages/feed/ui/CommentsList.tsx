"use client";

import { useQuery } from "convex/react";
import { User } from "lucide-react";

import { formatRelativeDate } from "@skill-based/ui/lib/dates";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface CommentsListProps {
  postId: string;
}

export function CommentsList({ postId }: CommentsListProps) {
  const comments = useQuery(api.comments.getComments, {
    postId: postId as Id<"posts">,
  });

  console.log(comments);

  return (
    <div className="mt-4 space-y-4">
      {comments?.map((comment) => (
        <div key={comment._id} className="flex items-start gap-3">
          <div className="relative">
            <User className="text-muted-foreground" size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.authorAddress}</span>
              <span className="text-muted-foreground text-sm">
                {formatRelativeDate(comment._creationTime)}
              </span>
            </div>
            <p className="mt-1 text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
