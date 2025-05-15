import { PlusIcon } from "lucide-react";
import { useWriteContract } from "wagmi";

import { Button } from "@skill-based/ui/components/button";
import { cn } from "@skill-based/ui/lib/utils";

import { abi } from "@/app/_shared/lib/abi";

export default function EndorseButton({
  className,
  tokenId,
  contractAddress,
  comment,
}: {
  className?: string;
  tokenId: bigint;
  contractAddress: `0x${string}`;
  comment: string;
}) {
  const { isPending, writeContract } = useWriteContract();

  const handleEndorse = () => {
    writeContract({
      address: contractAddress,
      abi,
      functionName: "endorseCertificate",
      args: [tokenId, comment],
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleEndorse}
      className={cn(className)}
    >
      <PlusIcon className="h-4 w-4" />
      Endorse
    </Button>
  );
}
