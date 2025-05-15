import { Suspense } from "react";

import AdditionalDetails from "@/app/_pages/profile/ui/AdditionalDetails";
import Connections from "@/app/_pages/profile/ui/Connections";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  return (
    <>
      <div className="col-start-1 row-start-2 mx-auto hidden w-full px-2 pt-4 lg:block">
        {/* Manager Section */}
        <div className="mx-auto max-w-xs">
          <Suspense fallback={<div>Loading...</div>}>
            <Connections params={params} />
          </Suspense>
        </div>
      </div>

      <div className="col-span-1 col-start-1 h-full overflow-y-hidden border-x lg:col-start-2">
        {children}
      </div>

      {/* Sidebar */}
      <div className="col-start-3 row-start-2 hidden h-full overflow-y-auto px-2 pt-4 lg:block">
        <div className="mx-auto max-w-xs">
          {/* Additional Details Section */}
          <AdditionalDetails />
        </div>
      </div>
    </>
  );
}
