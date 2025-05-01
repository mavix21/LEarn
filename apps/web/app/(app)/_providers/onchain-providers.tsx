"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";

import { getConfig } from "@/app/_shared/config/wagmi";
import { env } from "@/src/env";

interface Props {
  children: ReactNode;
  cookie?: string | null;
}

export function OnchainProviders({ children, cookie }: Props) {
  const initialState = cookieToInitialState(getConfig(), cookie);
  const [config] = useState(() => getConfig());
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
