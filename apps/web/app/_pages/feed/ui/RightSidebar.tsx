"use client";

import { Authenticated } from "convex/react";

import { TrendingTopics } from "./TrendingTopics";
import { WhoToFollow } from "./WhoToFollow";

export function RightSidebar() {
  return (
    <div>
      <Authenticated>
        <WhoToFollow />
      </Authenticated>
      {/* <TrendingTopics /> */}
    </div>
  );
}
