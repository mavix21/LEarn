import React from "react";

import { Skeleton } from "@skill-based/ui/components/skeleton";

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Background Image */}
      <div className="relative h-48 w-full rounded-lg">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="space-y-4 px-5">
        <div className="relative z-10 -mt-24 flex flex-col gap-4 md:-mt-14 md:flex-row md:items-end">
          <Skeleton className="size-32 rounded-full"></Skeleton>
          <div className="-mt-4 flex flex-grow flex-col items-start">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
