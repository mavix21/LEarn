import { headers } from "next/headers";

import { ConvexClientProvider, OnchainProviders } from "../../_providers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = (await headers()).get("cookie");

  return (
    <OnchainProviders cookie={cookie ?? undefined}>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </OnchainProviders>
  );
}
