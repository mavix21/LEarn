"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { createAppKit } from "@reown/appkit";
import { base, baseSepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cookieToInitialState, WagmiProvider } from "wagmi";

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
  defaultNetwork: baseSepolia,
  coinbasePreference: "smartWalletOnly",
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
  allWallets: "HIDE",
  featuredWalletIds: [
    "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // coinbase
    "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
  ],
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
