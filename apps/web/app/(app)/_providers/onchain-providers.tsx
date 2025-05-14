"use client";

import type { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base, baseSepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";

import { wagmiAdapter } from "@/reown";
import { env } from "@/src/env";

interface Props {
  children: ReactNode;
  cookie: string | null;
}

const queryClient = new QueryClient();

export function OnchainProviders({ children, cookie }: Props) {
  console.log("****************** OnchainProviders ******************");
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookie);

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
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
