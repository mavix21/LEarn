"use client";

import { Building, Hash, LinkIcon, Pencil, Trash2 } from "lucide-react";

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

import type { Certification } from "../model/credential";

interface CertificationCardProps {
  certification: Certification;
  onEdit: (certification: Certification) => void;
  onDelete: (id: string) => void;
}

export function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: CertificationCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{certification.name}</CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(certification)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive h-8 w-8"
              onClick={() => onDelete(certification.id)}
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
      </CardFooter>
    </Card>
  );
}
