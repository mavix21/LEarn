"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";

import { getConfig } from "@/app/_shared/config/wagmi.config";
import { env } from "@/src/env";

interface Props {
  children: ReactNode;
  cookie?: string | null;
}

export function OnchainProviders({ children, cookie }: Props) {
  console.log("****************** OnchainProviders ******************");
  const [config] = useState(() => getConfig());
  const initialState = cookieToInitialState(config, cookie);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
          config={{
            appearance: {
              mode: "auto",
              theme: "custom",
            },
          }}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
