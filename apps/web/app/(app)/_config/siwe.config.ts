import {
  createSIWEConfig,
  formatMessage,
  SIWECreateMessageArgs,
  SIWESession,
  SIWEVerifyMessageArgs,
} from "@reown/appkit-siwe";
import { AppKitNetwork } from "@reown/appkit/networks";
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react";
import { getAddress } from "viem";

import { chains } from "./wagmi.config";

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
        redirect: false,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
});
