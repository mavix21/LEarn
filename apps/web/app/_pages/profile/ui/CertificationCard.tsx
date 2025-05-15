"use client";

import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import {
  Building,
  CheckCircle,
  Hash,
  LinkIcon,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { createPortal } from "react-dom";
import {
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from "@skill-based/ui/components/card";
import { ScrollArea } from "@skill-based/ui/components/scroll-area";
import { cn } from "@skill-based/ui/lib/utils";

import type { Id } from "@/convex/_generated/dataModel";
import { abi } from "@/app/_shared/lib/abi";
import { api } from "@/convex/_generated/api";

import { uploadCertificateJSON } from "../api/file/route";
import { MintingOverlay } from "./MintingOverlay";

interface CertificationCardProps {
  certification: {
    _id: Id<"certifications">;
    name: string;
    issuingCompany: string;
    skills: string[];
    credentialId?: string;
    credentialUrl?: string;
    issueDate?: string;
    isMinted: boolean;
    media: { storageId: Id<"_storage">; type: "image" | "pdf" } | null;
  };
  mintRecipient: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function CertificationCard({
  certification,
  mintRecipient,
  onEdit,
  onDelete,
}: CertificationCardProps) {
  const {
    data: hash,
    isPending,
    writeContract,
  } = useWriteContract({
    mutation: {
      onSuccess: async () => {
        await updateMinted({
          id: certification._id,
          isMinted: true,
        });

        // watchContractEvent(config, {
        //   address: "0xb0b87c1269D82c4b6F5f1e8b5c800701e92A1933",
        //   abi,
        //   eventName: "CertificateMinted",
        //   onLogs(logs) {
        //     console.log("New logs events!", logs);
        //   },
        // });
      },
    },
  });
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const mediaUrl = useQuery(
    api.storage.getUrl,
    certification.media?.storageId
      ? { storageId: certification.media.storageId }
      : "skip",
  );

  const updateMinted = useMutation(api.certifications.updateMinted);

  const handleMint = async () => {
    const certificateUpload = await uploadCertificateJSON(
      certification.name,
      certification.issuingCompany,
      certification.issueDate ?? "",
      certification.credentialId ?? "",
      certification.credentialUrl ?? "",
      mediaUrl ?? "",
    );

    writeContract({
      address: "0xb0b87c1269D82c4b6F5f1e8b5c800701e92A1933",
      abi,
      functionName: "mintNFT",
      args: [
        mintRecipient as `0x${string}`,
        `https://rose-gentle-toucan-395.mypinata.cloud/ipfs/${certificateUpload?.cid}`,
      ],
    });
  };

  return (
    <>
      {(isPending || isConfirming) &&
        createPortal(<MintingOverlay />, document.body)}
      <Card className="row-span-5 grid grid-cols-1 grid-rows-subgrid gap-4 overflow-hidden pb-2">
        <CardImage className="row-span-1 row-start-1">
          {certification.media?.type === "image" && mediaUrl && (
            <Image
              src={mediaUrl}
              alt={`${certification.name} certificate`}
              width={500}
              height={500}
              className="mx-auto h-full w-auto object-cover"
            />
          )}
        </CardImage>
        <CardHeader className="row-span-1 row-start-2 grid-cols-[1fr_auto] grid-rows-1">
          <CardTitle className="line-clamp-2">{certification.name}</CardTitle>
          {!certification.isMinted && (
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive h-8 w-8"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}
        </CardHeader>
        <div className="row-span-1 row-start-3 px-6">
          <CardDescription className="flex items-center gap-1">
            <Building className="h-3.5 w-3.5" />
            {certification.issuingCompany}
          </CardDescription>
          {certification.issueDate && (
            <CardDescription className="text-xs">
              Issued: {new Date(certification.issueDate).toLocaleDateString()}
            </CardDescription>
          )}
        </div>
        <CardContent className="row-span-1 row-start-4 pb-2">
          <ScrollArea orientation="horizontal" className="w-full">
            <div className="flex flex-wrap gap-1.5">
              {certification.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-2">
            {certification.credentialId && (
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Hash className="h-3.5 w-3.5" />
                <span>ID: {certification.credentialId}</span>
              </div>
            )}
            {certification.credentialUrl && (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-2 text-xs hover:underline"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                <span>Verify Credential</span>
              </a>
            )}
          </div>
        </CardContent>
        <CardFooter className="row-span-1 row-start-5 flex flex-col items-end justify-center gap-4 border-t !pt-2">
          {!certification.isMinted ? (
            <Button
              variant="secondary"
              size="lg"
              className="relative ml-auto h-8 w-20 overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110"
              onClick={handleMint}
            >
              <span className="flex items-center gap-2">
                <span>Mint</span>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </span>
            </Button>
          ) : (
            <Badge
              variant="default"
              className={cn(
                "bg-primary text-primary-foreground animate-in fade-in zoom-in font-medium transition-all duration-500",
              )}
            >
              <CheckCircle className="mr-2 size-3" />
              Minted
            </Badge>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
