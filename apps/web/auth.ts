import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getName } from "@coinbase/onchainkit/identity";
import {
  getAddressFromMessage,
  getChainIdFromMessage,
} from "@reown/appkit-siwe";
import { importPKCS8, SignJWT } from "jose";
import { getServerSession } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import { createPublicClient, http } from "viem";
import { base, mainnet } from "viem/chains";

import { env } from "@/src/env";

import type { Id } from "./convex/_generated/dataModel";
import { ConvexAdapter } from "./src/convexAdapter";
import { createUser } from "./src/users/create-user.action";
import { updateDisplayName } from "./src/users/update-display-name.action";

const authSecret = env.NEXTAUTH_SECRET;
const projectId = env.NEXT_PUBLIC_WC_PROJECT_ID;
const CONVEX_SITE_URL = env.NEXT_PUBLIC_CONVEX_URL.replace(/.cloud$/, ".site");

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
      try {
        if (!credentials?.message) {
          throw new Error("Siwe message or signature is undefined");
        }

        const message = credentials.message;
        const signature = credentials.signature;

        const address = getAddressFromMessage(message) as `0x${string}`;
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
          address: address,
          signature: signature as `0x${string}`,
        });

        if (!isValid) {
          console.log("Invalid signature");
          return null;
        }

        const userId = await createUser(address);
        try {
          const [baseName, ensName] = await Promise.all([
            getName({ address, chain: base }),
            getName({ address, chain: mainnet }),
          ]);
          if (baseName) {
            await updateDisplayName({
              userId,
              displayName: baseName,
            });
          } else if (ensName) {
            await updateDisplayName({
              userId,
              displayName: ensName,
            });
          }
        } catch (error) {
          console.error("Error getting ens name", error);
        }

        return {
          id: `${chainId}:${address}:${userId}`,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  }),
];

export const config = {
  secret: authSecret,
  providers,
  session: {
    strategy: "jwt",
  },
  adapter: ConvexAdapter,
  callbacks: {
    async session({ session, token }) {
      if (!token.sub) return session;

      const [, chainId, address, userId] = token.sub.split(":");

      if (chainId && address && userId) {
        session.address = address;
        session.chainId = parseInt(chainId, 10);
        session.userId = userId as Id<"users">;
      }

      const privateKey = await importPKCS8(
        process.env.CONVEX_AUTH_PRIVATE_KEY!.replace(/\\n/g, "\n"),
        "RS256",
      );
      const convexToken = await new SignJWT({
        sub: session.userId,
      })
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setIssuer(CONVEX_SITE_URL)
        .setAudience("convex")
        .setExpirationTime("1h")
        .sign(privateKey);

      session.convexToken = convexToken;

      return session;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
