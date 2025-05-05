import React from "react";

import { ProfilePage } from "@/app/_pages/profile";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="col-start-2 row-start-2 h-full overflow-hidden">
      <ProfilePage userId={userId} />
    </div>
  );
}
