import Image from "next/image";
import { Edit2, FileText, Globe, Mail } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@skill-based/ui/components/avatar";
import { Button } from "@skill-based/ui/components/button";

import X from "@/app/_shared/ui/svg/X";

interface ProfileHeaderProps {
  name: string;
  title: string;
  location: string;
  avatarUrl: string;
}

export function ProfileHeader({
  name,
  title,
  location,
  avatarUrl,
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
          <Avatar className="border-primary size-32 rounded-full border-4">
            <AvatarImage
              src={avatarUrl || "/placeholder.svg?height=128&width=128"}
              alt={name}
            />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="-mt-4 flex flex-grow flex-col items-start">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-muted-foreground">{title || "No title"}</p>
            <p className="text-muted-foreground/50 mt-1 text-sm">
              {location || "No location"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="text-muted-foreground h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mail className="text-muted-foreground h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <FileText className="text-muted-foreground h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="text-muted-foreground h-5 w-5" />
            </Button>
          </div>
          <Button variant="default" size="sm" className="rounded-full">
            <Edit2 className="mr-1 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
