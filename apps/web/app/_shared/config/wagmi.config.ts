import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { AppKitNetwork } from "@reown/appkit/networks";
import {
  createAppKit,
  useAppKit,
  useAppKitAccount,
  useAppKitEvents,
  useAppKitNetwork,
  useAppKitState,
  useAppKitTheme,
  useDisconnect,
  useWalletInfo,
} from "@reown/appkit/react";
import { cookieStorage, createStorage, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

import { env } from "@/src/env";

import { chains } from "./chains";
import { siweConfig } from "./siwe.config";

const projectId = env.NEXT_PUBLIC_WC_PROJECT_ID;

export const metadata = {
  name: "SkillBased",
  description: "SIWE Example",
  url: "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId,
  ssr: true,
  chains: [base, baseSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    coinbaseWallet({
      appName: "OnchainKit",
      preference: "smartWalletOnly",
      version: "4",
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// Create modal
const modal = createAppKit({
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

export function getConfig() {
  return wagmiAdapter.wagmiConfig;
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}

export {
  modal,
  useAppKit,
  useAppKitState,
  useAppKitTheme,
  useAppKitEvents,
  useAppKitAccount,
  useWalletInfo,
  useAppKitNetwork,
  useDisconnect,
};
