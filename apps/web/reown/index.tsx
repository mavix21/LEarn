import type {
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
} from "@reown/appkit-siwe";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createSIWEConfig, formatMessage } from "@reown/appkit-siwe";
import { base, baseSepolia } from "@reown/appkit/networks";
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
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";
import { getAddress, http } from "viem";
import { cookieStorage, createStorage } from "wagmi";
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

const normalizeAddress = (address: string) => {
  try {
    const splitAddress = address.split(":");
    const extractedAddress = splitAddress[splitAddress.length - 1];
    const checksumAddress = getAddress(extractedAddress!);
    splitAddress[splitAddress.length - 1] = checksumAddress;
    const normalizeAddress = splitAddress.join(":");

    return normalizeAddress;
  } catch (error) {
    console.error(error);
    return address;
  }
};

export const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: chains.map((chain: AppKitNetwork) => parseInt(chain.id.toString())),
    statement: "Please sign with your wallet to continue",
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) =>
    formatMessage(args, normalizeAddress(address)),
  getNonce: async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Failed to get nonce!");

    return nonce;
  },
  getSession: async () => {
    const session = await getSession();
    if (!session) return null;

    if (
      typeof session.address !== "string" ||
      typeof session.chainId !== "number"
    )
      return null;

    return {
      address: session.address,
      chainId: session.chainId,
    } satisfies SIWESession;
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      const success = await signIn("credentials", {
        message,
        redirect: false,
        signature,
        callbackUrl: "/feed",
      });

      return Boolean(success?.ok);
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/feed",
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});

export const metadata = {
  name: "SkillBased",
  description: "Build your verified skills",
  url: "https://skill-based-web.vercel.app", // origin must match your domain & subdomain
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
    email: false, // default to true
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
