"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "convex/react";
import {
  Building,
  ExternalLink,
  Hash,
  LinkIcon,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
import { parseEventLogs } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

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
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@skill-based/ui/components/dialog";
import { GlowEffect } from "@skill-based/ui/components/glow-effect";
import { ScrollArea } from "@skill-based/ui/components/scroll-area";

import type { Doc } from "@/convex/_generated/dataModel";
import { abi } from "@/app/_shared/lib/abi";
import { CERTIFICATION_CONTRACT_ADDRESS } from "@/app/_shared/lib/constants";
import { api } from "@/convex/_generated/api";

import { uploadCertificateJSON } from "../api/file/route";
import EndorseForm from "./EndorseForm";
import { MintingOverlay } from "./MintingOverlay";

interface CertificationCardProps {
  certification: Doc<"certifications">;
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
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const updateMinted = useMutation(api.certifications.updateMinted);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    data,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isSuccess) {
      for (const log of data.logs) {
        const events = parseEventLogs({
          abi,
          logs: [log],
        });
        for (const event of events) {
          if (event.eventName === "Transfer") {
            const { tokenId } = event.args;
            console.log(tokenId);
            updateMinted({
              id: certification._id,
              contractAddress: CERTIFICATION_CONTRACT_ADDRESS,
              tokenId: tokenId,
            })
              .then(() => console.log("Minted"))
              .catch((error) => console.error(error));
            return;
          }
        }
      }
    }
  }, [isSuccess, data]);

  const mediaUrl = useQuery(
    api.storage.getUrl,
    certification.media.storageId
      ? { storageId: certification.media.storageId }
      : "skip",
  );

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
      address: CERTIFICATION_CONTRACT_ADDRESS,
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
      <Card className="relative row-span-5 grid grid-cols-1 grid-rows-subgrid gap-4 pb-2">
        <div className="relative row-span-1 row-start-1">
          <CardImage
            withOverlay={certification.mintingStatus.type === "minted"}
          >
            {certification.media.type === "image" && mediaUrl && (
              <Image
                src={mediaUrl}
                alt={`${certification.name} certificate`}
                width={500}
                height={500}
                className="mx-auto h-full w-auto object-cover"
              />
            )}
          </CardImage>
          {certification.mintingStatus.type === "minted" && (
            <a
              href={`https://opensea.io/item/base/${CERTIFICATION_CONTRACT_ADDRESS}/${certification.mintingStatus.tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Badge className="absolute bottom-2 left-4 flex items-center justify-center gap-1 overflow-hidden rounded-md bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-xs font-semibold text-white">
                <span className="group-hover:underline">Minted</span>
                <ExternalLink className="size-4" />
              </Badge>
            </a>
          )}
        </div>
        <CardHeader className="row-span-1 row-start-2 grid-cols-[1fr_auto] grid-rows-1">
          <CardTitle className="line-clamp-2">{certification.name}</CardTitle>
          {certification.mintingStatus.type === "not_minted" && (
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
        <div className="row-span-1 row-start-3 px-4">
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
        <CardContent className="row-span-1 row-start-4 space-y-2 pb-2">
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
          {certification.mintingStatus.type === "minted" ? (
            <>
              {certification.userId !== session?.userId ? (
                <div className="relative flex h-full w-full justify-between">
                  {certification.mintingStatus.endorsements.some(
                    (endorsement) => endorsement.userId === session?.userId,
                  ) ? (
                    <Badge variant="outline" className="w-full">
                      Endorsed
                    </Badge>
                  ) : (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full">Endorse</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <EndorseForm
                          certificationId={certification._id}
                          tokenId={certification.mintingStatus.tokenId}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              ) : (
                <div className="relative flex h-full w-full justify-between">
                  <Badge variant="outline" className="w-full">
                    Endorses: {certification.mintingStatus.endorsements.length}
                  </Badge>
                </div>
              )}
            </>
          ) : (
            <>
              {certification.userId === session?.userId ? (
                <div className="relative flex w-full justify-center">
                  <GlowEffect
                    colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
                    mode="colorShift"
                    blur="soft"
                    duration={3}
                    scale={0.9}
                  />
                  <Button
                    size="lg"
                    className="relative mx-auto w-[calc(100%-1rem)] bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110"
                    onClick={handleMint}
                  >
                    <span className="flex items-center gap-2">
                      <span>Mint</span>
                      <Sparkles className="h-5 w-5 animate-pulse" />
                    </span>
                  </Button>
                </div>
              ) : (
                <div className="relative flex w-full justify-center">
                  <Button disabled variant="ghost" className="w-full">
                    Not Minted
                  </Button>
                </div>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
