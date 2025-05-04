import type { AppKitNetwork } from "@reown/appkit/networks";
import { base, baseSepolia } from "@reown/appkit/networks";

export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [
  base,
  baseSepolia,
  // mainnet,
  // arbitrum,
  // optimism,
  // sepolia,
];
