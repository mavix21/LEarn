"use client";

import type { ReactNode } from "react";
import { OnchainKitProvider as RootOnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";

import { env } from "@/src/env";

export function OnchainKitProvider(props: { children: ReactNode }) {
  return (
    <RootOnchainKitProvider
      apiKey={env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
        },
      }}
    >
      {props.children}
    </RootOnchainKitProvider>
  );
}
