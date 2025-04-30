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
import { base } from "viem/chains";
import { useAccount } from "wagmi";

import { Skeleton } from "@skill-based/ui/components/skeleton";
import { cn } from "@skill-based/ui/lib/utils";

const Identity = dynamic(
  () => import("@coinbase/onchainkit/identity").then((mod) => mod.Identity),
  {
    loading: () => <Skeleton className="h-16 w-72" />,
    ssr: false,
  },
);

export default function ProfileCard({ className }: { className?: string }) {
  const { isConnected, address, isConnecting } = useAccount();

  console.log("address", address);

  return (
    <div className={cn("p-6", className)}>
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
        {address && (
          <Identity address={address} chain={base}>
            <Avatar className="block size-16" />
            <Name>
              <Badge />
            </Name>
            <Address />
            <Socials />
          </Identity>
        )}
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
        <Wallet>
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
        </Wallet>
      </div>
    </div>
  );
}
