import { headers } from "next/headers";

import { auth } from "@/auth";

import { ConvexClientProvider, OnchainProviders } from "../../_providers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get("cookie");
  const session = await auth();

  return (
    <OnchainProviders cookie={cookie}>
      <ConvexClientProvider session={session}>{children}</ConvexClientProvider>
    </OnchainProviders>
  );
}
