"use client";

import React from "react";
import { NFTCard } from "@coinbase/onchainkit/nft";
import {
  NFTLastSoldPrice,
  NFTMedia,
  NFTNetwork,
  NFTOwner,
  NFTTitle,
} from "@coinbase/onchainkit/nft/view";
import { ChevronRight, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@skill-based/ui/components/avatar";
import { Button } from "@skill-based/ui/components/button";

function NFTData() {
  return {
    title: "My NFT",
    imageUrl: "https://example.com/image.png",
  };
}

export function Groups() {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Groups</h2>
        <Button variant="ghost" size="sm">
          View All
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center rounded-lg border p-3">
          <div className="bg-accent mr-3 rounded-full p-2">
            <Users className="text-accent-foreground h-5 w-5" />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">Group Name Here</h3>
            <p className="text-muted-foreground text-sm">
              Online Resource Group
            </p>
          </div>
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2">
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2">
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2">
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-muted-foreground ml-2 text-sm">
            817 Members
          </span>
        </div>

        <div className="flex items-center rounded-lg border p-3">
          <div className="bg-accent mr-3 rounded-full p-2">
            <Users className="text-accent-foreground h-5 w-5" />
          </div>
          <div className="flex-grow">
            <h3 className="font-medium">Group Name Here</h3>
            <p className="text-muted-foreground text-sm">
              Online Resource Group
            </p>
          </div>
          <div className="flex -space-x-2">
            <Avatar className="h-8 w-8 border-2">
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2">
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <Avatar className="h-8 w-8 border-2">
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
          </div>
          <span className="text-muted-foreground ml-2 text-sm">
            231 Members
          </span>
        </div>
      </div>
      <div>
        <NFTCard
          tokenId="1"
          contractAddress="0xb96F1123B36b405e79D0E721Ca5D9ACd7CA99D49"
          // useNFTData={NFTData}
        >
          <NFTMedia />
          <NFTTitle />
          <NFTOwner />
          <NFTNetwork />
        </NFTCard>
      </div>
    </div>
  );
}
