"use client";

import dynamic from "next/dynamic";
import {
  Address,
  Avatar,
  Badge,
  Name,
  Socials,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Authenticated, Unauthenticated } from "convex/react";
import { base } from "viem/chains";
import { useAccount } from "wagmi";

import { Button } from "@skill-based/ui/components/button";
import { Card, CardAction, CardContent } from "@skill-based/ui/components/card";
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
  const { isConnected, address, isConnecting } = useAccount();
  const { open } = useAppKit();

  console.log("address", address);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col items-center justify-center gap-2">
        {/* <AvatarWithLoading
          className="size-32"
          address={address}
          alt="Profile picture"
          loadingComponent={<Skeleton className="size-32 rounded-full" />}
        />

        {isConnected && (
          <NameWithLoading
            className="h-6 text-xl font-bold"
            address={address}
            chain={base}
          />
        )} */}

        {/* <IdentityCardWithLoading address={address} chain={base} />
        <SocialsWithLoading address={address} chain={base} /> */}
        <Authenticated>
          {address && (
            <Card
              className="hover:!bg-muted group w-full cursor-pointer transition-colors"
              onClick={() => open({ view: "Account" })}
            >
              <CardContent>
                <Identity
                  address={address}
                  chain={base}
                  className="group-hover:bg-muted transition-colors"
                >
                  <Avatar className="block size-16" />
                  <Name>
                    <Badge tooltip="Coinbase verified account" />
                  </Name>
                  <Address hasCopyAddressOnClick />
                  <Socials />
                </Identity>
              </CardContent>
            </Card>
          )}
        </Authenticated>
        {/* <h2 className="mt-4 text-xl font-bold">Alisson Rochinski</h2>
        <p className="text-muted-foreground text-sm">arochinski</p>
        <p className="text-muted-foreground mt-1 text-xs">skillbased.net</p>

        <p className="mt-4 text-sm">UI Designer | Let's redesign the world</p>
        <p className="text-sm">alisson.rochinski@gmail.com</p>

        <p className="text-muted-foreground mt-4 text-sm">
          2957 seguidores · rochinski.com
        </p> */}
        {/* <Wallet />
        <Socials address={address} /> */}
        {/* <Wallet>
          <ConnectWallet>
            <Avatar className="h-6 w-6" />
            <Name />
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pb-2 pt-3" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet> */}

        <Unauthenticated>
          <ConnectCard />
        </Unauthenticated>
      </div>
    </div>
  );
}
