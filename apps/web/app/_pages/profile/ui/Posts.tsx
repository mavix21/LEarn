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

      {/* <div className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-grow">
            <h3 className="mb-1 font-medium">
              Spotify $10 Evergreen Referral Incentive is Live!
            </h3>
            <p className="text-sm text-gray-500">James Harrison</p>
            <p className="text-xs">Posted on February 1, 2021</p>
          </div>
          <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-yellow-100">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Post thumbnail"
              width={80}
              height={80}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-grow">
            <h3 className="mb-1 font-medium">
              Spotify $10 Evergreen Referral Incentive is Live!
            </h3>
            <p className="text-sm text-gray-500">Judith Nguyen</p>
            <p className="text-xs">Posted on February 1, 2021</p>
          </div>
          <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-pink-100">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Post thumbnail"
              width={80}
              height={80}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-grow">
            <h3 className="mb-1 font-medium">
              Spotify $10 Evergreen Referral Incentive is Live!
            </h3>
            <p className="text-sm text-gray-500">Aaron Cooper</p>
            <p className="text-xs">Posted on February 1, 2021</p>
          </div>
          <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-blue-100">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Post thumbnail"
              width={80}
              height={80}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </div> */}
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
