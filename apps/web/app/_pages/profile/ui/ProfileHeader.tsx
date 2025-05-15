"use client";

import type { Preloaded } from "convex/react";
import { Avatar, Socials } from "@coinbase/onchainkit/identity";
import { usePreloadedQuery } from "convex/react";
import { Edit2 } from "lucide-react";
import { base } from "viem/chains";

import { Button } from "@skill-based/ui/components/button";

import type { api } from "@/convex/_generated/api";

import { CoverImageEditor } from "./CoverImageEditor";

interface ProfileHeaderProps {
  preloadedUser: Preloaded<typeof api.users.getUserProfile>;
}

export function ProfileHeader({ preloadedUser }: ProfileHeaderProps) {
  const user = usePreloadedQuery(preloadedUser);

  return (
    <div className="space-y-6">
      {/* Cover Image */}
      <CoverImageEditor
        coverImageUrl={user.coverImageUrl}
        coverImageStorageId={user.coverImageStorageId}
        isMe={user.isMe}
      />
      <div className="space-y-4 px-5">
        <div className="relative z-10 -mt-24 flex flex-col gap-4 md:-mt-14 md:flex-row md:items-end">
          <Avatar
            address={user.address}
            chain={base}
            className="size-32 rounded-full"
          />
          <div className="-mt-4 flex flex-grow flex-col items-start">
            <h1 className="max-w-56 truncate text-2xl font-bold">
              {user.name}
            </h1>
            <p className="text-muted-foreground">{user.title || "No title"}</p>
            <p className="text-muted-foreground/50 mt-1 text-sm">
              {user.location || "No location"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Socials address={user.address} chain={base} />
          {user.isMe && (
            <Button variant="default" size="sm" className="ml-auto">
              <Edit2 className="mr-1 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
