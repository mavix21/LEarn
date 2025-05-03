import type { SIWESession } from "@reown/appkit-siwe";
import NextAuth from "next-auth";

import type { Id } from "@/convex/_generated/dataModel";
import { config } from "@/auth";

declare module "next-auth" {
  interface Session extends SIWESession {
    address: string;
    chainId: number;
    userId: Id<"users">;
    convexToken: string;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(config);

export { handler as GET, handler as POST };
