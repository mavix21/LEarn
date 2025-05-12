"use client";

import Image from "next/image";
import { Avatar, Socials } from "@coinbase/onchainkit/identity";
import { Edit2 } from "lucide-react";
import { base } from "viem/chains";

import { Button } from "@skill-based/ui/components/button";

interface ProfileHeaderProps {
  name: string;
  title: string;
  location: string;
  avatarUrl: string;
  address: `0x${string}`;
}

export function ProfileHeader({
  name,
  title,
  location,
  avatarUrl,
  address,
}: ProfileHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Background Image */}
      <div className="relative h-48 w-full rounded-lg">
        <Image
          src="/placeholder.svg"
          alt="Profile background"
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-4 px-5">
        <div className="relative z-10 -mt-24 flex flex-col gap-4 md:-mt-14 md:flex-row md:items-end">
          <Avatar
            address={address}
            chain={base}
            className="border-primary size-32 rounded-full border-4"
          />
          <div className="-mt-4 flex flex-grow flex-col items-start">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">{title || "No title"}</p>
            <p className="text-muted-foreground/50 mt-1 text-sm">
              {location || "No location"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Socials address={address} chain={base} />
          <Button variant="default" size="sm" className="rounded-full">
            <Edit2 className="mr-1 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
