"use client";

import type { Preloaded } from "convex/react";
import React from "react";
import { usePreloadedQuery } from "convex/react";
import { Edit2 } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";

import type { api } from "@/convex/_generated/api";

export function SummarySection({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.getUserProfile>;
}) {
  const { bio } = usePreloadedQuery(preloadedUser);

  return (
    <div className="space-y-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Bio</h2>
        <Button variant="ghost" size="sm" className="p-1">
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-muted-foreground space-y-2">
        {bio ? <p>{bio}</p> : <p className="italic">No bio provided.</p>}
      </div>
    </div>
  );
}
