"use client";

import dynamic from "next/dynamic";
import {
  Address,
  Avatar,
  Badge,
  Name,
  Socials,
} from "@coinbase/onchainkit/identity";
import { Authenticated, Unauthenticated } from "convex/react";
import { base } from "viem/chains";
import { useAccount } from "wagmi";

import { Card, CardContent } from "@skill-based/ui/components/card";
import { Skeleton } from "@skill-based/ui/components/skeleton";
import { cn } from "@skill-based/ui/lib/utils";

import { useAppKit } from "@/reown";

import ConnectCard from "./ConnectCard";

const Identity = dynamic(
  () => import("@coinbase/onchainkit/identity").then((mod) => mod.Identity),
  {
    loading: () => <Skeleton className="h-16 w-full" />,
    ssr: false,
  },
);

export default function ProfileCard({ className }: { className?: string }) {
  const { address } = useAccount();
  const { open } = useAppKit();

  console.log("address", address);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col items-center justify-center gap-2">
        <Authenticated>
          {address && (
            <Card className="w-full">
              <CardContent className="space-y-2">
                <Avatar
                  address={address}
                  chain={base}
                  className="mx-auto size-32 cursor-pointer"
                  onClick={() => open({ view: "Account" })}
                />
                <Identity
                  className="**:!ml-0 *:justify-center"
                  address={address}
                  chain={base}
                >
                  <Name className="mx-auto">
                    <Badge tooltip="Coinbase verified account" />
                  </Name>
                  <Address className="text-center" hasCopyAddressOnClick />
                  <Socials className="flex justify-center pl-0" />
                </Identity>
              </CardContent>
            </Card>
          )}
        </Authenticated>
        <Unauthenticated>
          <ConnectCard />
        </Unauthenticated>
      </div>
    </div>
  );
}
