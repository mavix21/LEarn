"use client";

import React from "react";
import { useQuery } from "convex/react";
import { Settings } from "lucide-react";

import { api } from "@/convex/_generated/api";

function extractHashtags(content: string) {
  return content.match(/#\w+/g)?.map((tag) => tag.slice(1)) ?? [];
}

export function TrendingTopics() {
  const trendingTopics = useQuery(api.posts.getHashtagsContent);
  console.log(trendingTopics);

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Trending Topics</h2>
        <Settings size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground text-xs">DESIGN</p>
          <p className="font-medium">ThreadsDesktop</p>
          <p className="text-muted-foreground text-xs">123.9k threads</p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs">MOVIES AND SERIES</p>
          <p className="font-medium">Spider-Man: Across the Spider-Verse</p>
          <p className="text-muted-foreground text-xs">93.4k threads</p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs">TECH</p>
          <p className="font-medium">iPhone 15</p>
          <p className="text-muted-foreground text-xs">85.2k threads</p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs">GAMES</p>
          <p className="font-medium">Riot Games</p>
          <p className="text-muted-foreground text-xs">71.9k threads</p>
        </div>

        <div>
          <p className="text-muted-foreground text-xs">DESIGN</p>
          <p className="font-medium">#Minimalism</p>
          <p className="text-muted-foreground text-xs">69.1k threads</p>
        </div>

        <p className="text-sm text-blue-400">see more</p>
      </div>
    </>
  );
}
