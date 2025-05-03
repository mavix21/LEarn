import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { AppKitNetwork } from "@reown/appkit/networks";
import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base, baseSepolia, mainnet } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

import { env } from "@/src/env";

const projectId = env.NEXT_PUBLIC_WC_PROJECT_ID;

export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [
  base,
  baseSepolia,
  // mainnet,
  // arbitrum,
  // optimism,
  // sepolia,
];

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

export function getConfig() {
  return wagmiAdapter.wagmiConfig;
  // return createConfig({
  //   chains: [base, baseSepolia],
  //   connectors: [
  //     coinbaseWallet({
  //       appName: "OnchainKit",
  //       preference: "smartWalletOnly",
  //       version: "4",
  //     }),
  //   ],
  //   storage: createStorage({
  //     storage: cookieStorage,
  //   }),
  //   ssr: true,
  //   transports: {
  //     [base.id]: http(),
  //     [baseSepolia.id]: http(),
  //   },
  // });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
