import type { SIWESession } from "@reown/appkit-siwe";
import {
  getAddressFromMessage,
  getChainIdFromMessage,
} from "@reown/appkit-siwe";
import NextAuth from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import { createPublicClient, http } from "viem";

import { env } from "@/src/env";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
  }
}

const authSecret = env.NEXTAUTH_SECRET;
const projectId = env.NEXT_PUBLIC_WC_PROJECT_ID;

const providers = [
  credentialsProvider({
    name: "Ethereum",
    credentials: {
      message: {
        label: "Message",
        type: "text",
        placeholder: "0x0",
      },
      signature: {
        label: "Signature",
        type: "text",
        placeholder: "0x0",
      },
    },
    async authorize(credentials) {
      console.log("credentials", credentials);
      try {
        if (!credentials?.message) {
          throw new Error("Siwe message or signature is undefined");
        }

        const message = credentials.message;
        const signature = credentials.signature;

        const address = getAddressFromMessage(message);
        const chainId = getChainIdFromMessage(message);

        // const isValid = await verifySignature({
        //   address,
        //   message,
        //   signature,
        //   chainId,
        //   projectId,
        // });

        const publicClient = createPublicClient({
          transport: http(
            `https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${projectId}`,
          ),
        });
        const isValid = await publicClient.verifyMessage({
          message,
          address: address as `0x${string}`,
          signature: signature as `0x${string}`,
        });

        if (!isValid) return null;

        return {
          id: `${chainId}:${address}`,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  }),
];

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth({
  secret: authSecret,
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (!token.sub) return session;

      const [, chainId, address] = token.sub.split(":");

      if (chainId && address) {
        session.address = address;
        session.chainId = parseInt(chainId, 10);
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
