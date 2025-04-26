"use client";

import type { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";

import { env } from "@/src/env";

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: "auto",
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
