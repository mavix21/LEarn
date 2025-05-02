"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { createAppKit } from "@reown/appkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";

import { env } from "@/src/env";

import { siweConfig } from "../_config/siwe.config";
import {
  chains,
  getConfig,
  metadata,
  wagmiAdapter,
} from "../_config/wagmi.config";

interface Props {
  children: ReactNode;
  cookie?: string | null;
}

const projectId = env.NEXT_PUBLIC_WC_PROJECT_ID;

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: chains,
  projectId,
  siweConfig,
  metadata,
  features: {
    email: true, // default to true
    socials: [
      "google",
      "x",
      "github",
      "discord",
      "apple",
      "facebook",
      "farcaster",
    ],
    emailShowWallets: true, // default to true
  },
});

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
