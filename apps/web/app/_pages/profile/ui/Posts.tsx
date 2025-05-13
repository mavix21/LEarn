"use client";

import { useQuery } from "convex/react";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";

import { api } from "@/convex/_generated/api";

import { Post } from "../../feed/ui";

export function Posts() {
  const myPosts = useQuery(api.posts.getPostsByAuthorId);
  const isLoading = myPosts === undefined;

  const PostSkeleton = () => (
    <div className="bg-card animate-pulse rounded-xl border p-4">
      <div className="flex items-center space-x-4">
        <div className="bg-muted h-12 w-12 rounded-full"></div>
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Posts</h2>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 text-blue-600 hover:text-blue-700"
          >
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : (
        myPosts.map((post) => (
          <Post
            key={post._id}
            postId={post._id}
            authorName={post.authorName}
            content={post.content}
            creationTime={post._creationTime}
            attachmentsUrls={post.attachments}
          />
        ))
      )}
    </div>
  );
}
