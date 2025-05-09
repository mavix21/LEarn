import Link from "next/link";
import { User } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@skill-based/ui/components/avatar";
import { Button } from "@skill-based/ui/components/button";
import { Card, CardContent } from "@skill-based/ui/components/card";
import { Skeleton } from "@skill-based/ui/components/skeleton";

interface UserProps {
  displayName: string;
  isFollowing: boolean;
  onFollow: () => void;
}

export function FollowCard({ displayName, isFollowing, onFollow }: UserProps) {
  return (
    <Card className="bg-card w-full max-w-sm border shadow-none">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${displayName}`}
              className="flex items-center gap-3"
            >
              <Avatar className="bg-background h-10 w-10 border">
                <AvatarImage src="/placeholder.svg" alt={displayName} />
                <AvatarFallback>
                  <User className="text-muted-foreground h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium hover:underline">
                  {displayName}
                </span>
                <span className="text-muted-foreground text-sm">
                  @{displayName}
                </span>
              </div>
            </Link>
          </div>
          <Button
            variant={isFollowing ? "outline" : "default"}
            className={
              isFollowing
                ? "hover:bg-destructive/10 hover:text-destructive"
                : "bg-primary hover:bg-primary/80"
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

export function FollowCardSkeleton() {
  return (
    <Card className="bg-muted w-full max-w-sm border-0 shadow-none">
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="bg-background h-10 w-10 rounded-full border" />
              <div className="flex flex-col">
                <Skeleton className="mb-1 h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
