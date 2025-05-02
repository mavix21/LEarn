import * as React from "react";

import { Toaster } from "@skill-based/ui/components/sonner";

import { ProfileCard } from "@/app/(app)/_pages/feed/ui";

import Trending from "../Trending";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <div className="col-start-1 row-start-2 hidden w-full lg:block">
        <div className="mx-auto w-full max-w-xs">
          <ProfileCard />
        </div>
      </div>

      <div className="col-start-1 h-full flex-1 overflow-hidden border-x lg:col-start-2">
        {children}
      </div>

      {/* Right Sidebar - Trending */}
      <div className="col-span-1 col-start-3 row-start-2 hidden max-w-xs p-6 lg:block">
        <Trending />
      </div>
      <Toaster />
    </React.Fragment>
  );
}
