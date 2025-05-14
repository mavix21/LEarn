"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import {
  Building,
  File,
  Hash,
  LinkIcon,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useWriteContract } from "wagmi";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@skill-based/ui/components/card";
import { ScrollArea } from "@skill-based/ui/components/scroll-area";

import type { Id } from "@/convex/_generated/dataModel";
import { abi } from "@/app/_shared/lib/abi";
import { api } from "@/convex/_generated/api";

import { uploadCertificateJSON } from "../api/file/route";

interface CertificationCardProps {
  certification: {
    _id: Id<"certifications">;
    name: string;
    issuingCompany: string;
    skills: string[];
    credentialId?: string;
    credentialUrl?: string;
    issueDate?: string;
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
  const { data: hash, writeContract } = useWriteContract();

  const mediaUrl = useQuery(
    api.storage.getUrl,
    certification.media?.storageId
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

    console.log(
      "certificateUpload",
      certificateUpload,
      "address",
      mintRecipient,
    );

    console.log("pinata");

    const tokenId = writeContract({
      address: "0xb0b87c1269D82c4b6F5f1e8b5c800701e92A1933",
      abi,
      functionName: "mintNFT",
      args: [
        mintRecipient as `0x${string}`,
        `https://rose-gentle-toucan-395.mypinata.cloud/ipfs/${certificateUpload?.cid}`,
      ],
    });

    console.log(tokenId);
    return tokenId;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{certification.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="secondary"
              size="lg"
              className="relative h-8 w-20 overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110"
              onClick={handleMint}
            >
              <span className="flex items-center gap-2">
                <span>Mint</span>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </span>
            </Button>
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
        </div>
        <CardDescription className="flex items-center gap-1">
          <Building className="h-3.5 w-3.5" />
          {certification.issuingCompany}
        </CardDescription>
        {certification.issueDate && (
          <CardDescription className="text-xs">
            Issued: {new Date(certification.issueDate).toLocaleDateString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <ScrollArea orientation="horizontal" className="w-full">
          <div className="flex flex-wrap gap-1.5">
            {certification.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </ScrollArea>
        {certification.media?.type === "image" && mediaUrl && (
          <div className="mt-4">
            <Image
              src={mediaUrl}
              alt={`${certification.name} certificate`}
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 border-t pt-3">
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
        {certification.media && (
          <div className="flex items-center gap-2 text-sm">
            <File className="h-4 w-4" />
            <span className="font-medium">Media:</span>{" "}
            {certification.media.type.toUpperCase()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
