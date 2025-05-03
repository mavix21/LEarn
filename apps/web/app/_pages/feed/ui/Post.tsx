import Image from "next/image";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Triangle,
  User,
} from "lucide-react";

import { formatRelativeDate } from "@skill-based/ui/lib/utils";

interface PostProps {
  content: string;
  creationTime: number;
}

export function Post({ content, creationTime }: PostProps) {
  return (
    <div className="border-b">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <User className="text-muted-foreground" size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <span className="font-medium">aura</span>
                <span className="text-muted-foreground ml-2 text-sm">
                  {formatRelativeDate(creationTime)}
                </span>
              </div>
              <MoreHorizontal size={20} className="text-muted-foreground" />
            </div>
            <p className="mt-1 whitespace-pre-line break-words">{content}</p>
            <div className="mt-4 flex gap-4">
              <Heart size={20} className="text-muted-foreground" />
              <MessageCircle size={20} className="text-muted-foreground" />
              <Repeat2 size={20} className="text-muted-foreground" />
              <Triangle size={20} className="text-muted-foreground" />
            </div>
            <div className="text-muted-foreground mt-2 flex items-center text-sm">
              <span>7 respostas · 59 curtidas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
