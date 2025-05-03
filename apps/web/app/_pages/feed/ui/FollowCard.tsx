import { User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@skill-based/ui/components/avatar";
import { Button } from "@skill-based/ui/components/button";
import { Card, CardContent } from "@skill-based/ui/components/card";

interface UserProps {
  username: string;
  handle: string;
  isFollowing: boolean;
  onFollow: () => void;
}

export function FollowCard({
  username,
  handle,
  isFollowing,
  onFollow,
}: UserProps) {
  return (
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="bg-background h-10 w-10 border">
              <AvatarImage src="/placeholder.svg" alt={username} />
              <AvatarFallback>
                <User className="text-muted-foreground h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{username}</span>
              <span className="text-muted-foreground text-sm">{handle}</span>
            </div>
          </div>
          <Button
            variant={isFollowing ? "outline" : "default"}
            className={
              isFollowing
                ? "hover:bg-destructive/10 hover:text-destructive"
                : "bg-green-500 hover:bg-green-600"
            }
            onClick={onFollow}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
