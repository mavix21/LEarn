"use client";

import type { Preloaded } from "convex/react";
import React from "react";
import { usePreloadedQuery } from "convex/react";
import { Check, ChevronDown, Edit2 } from "lucide-react";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";

import type { api } from "@/convex/_generated/api";

export function AskMeAbout({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.getUserProfile>;
}) {
  const user = usePreloadedQuery(preloadedUser);

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center text-xl font-semibold">
          Ask Me About
          <Badge className="ml-2">{user.topics.length}</Badge>
        </h2>
        <Button variant="ghost" size="sm">
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {user.topics.length > 0 ? (
          user.topics.map(({ topic, endorsements }, idx: number) => (
            <div key={topic || idx} className="flex items-center border-b py-2">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span className="flex-grow">{topic}</span>
              {typeof endorsements === "number" && (
                <Badge className="bg-muted">+{endorsements}</Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </div>
          ))
        ) : (
          <div className="text-muted-foreground italic">
            No topics added yet.
          </div>
        )}
      </div>
    </div>
  );
}
