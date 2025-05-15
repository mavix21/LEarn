import type { Preloaded } from "convex/react";
import type { ConvexError } from "convex/values";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { preloadedQueryResult, preloadQuery } from "convex/nextjs";
import { Edit2 } from "lucide-react";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skill-based/ui/components/tabs";

import type { Id } from "@/convex/_generated/dataModel";
import { auth } from "@/auth";
import { api } from "@/convex/_generated/api";
import { tryCatch } from "@/src/lib/try-catch";

import { CertificationsSection } from "./ui/CertificationsSection";
import { Posts } from "./ui/Posts";
import { ProfileHeader } from "./ui/ProfileHeader";
import { SummarySection } from "./ui/SummarySection";
import { TalentTab } from "./ui/TalentTab";
import { TalentTabSkeleton } from "./ui/TalentTabSkeleton";

export async function ProfilePage({ userId }: { userId: string }) {
  const data = await auth();
  if (!data) redirect("/feed");

  const { convexToken: token } = data;

  const result = await tryCatch<
    Preloaded<typeof api.users.getUserProfile>,
    ConvexError<{ message: string }>
  >(
    preloadQuery(
      api.users.getUserProfile,
      {
        userId: userId as Id<"users">,
      },
      { token },
    ),
  );

  if (result.error) {
    return <div>Error: {result.error.data.message}</div>;
  }

  const preloadedUser = result.data;

  return (
    <div className="bg-card container mx-auto h-full max-w-4xl space-y-4 overflow-y-auto">
      <ProfileHeader preloadedUser={preloadedUser} />

      <div className="px-5">
        {/* Main Content */}
        <div className="w-full">
          <Tabs defaultValue="overview" className="w-full space-y-4">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="talent">Talent</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Summary Section */}
              <SummarySection preloadedUser={preloadedUser} />

              {/* Hobbies Section */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Hobbies</h2>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Edit2 className="size-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge>Dogs</Badge>
                  <Badge>Football</Badge>
                  <Badge>Basketball</Badge>
                  <Badge>The Witcher</Badge>
                  <Badge>Ice Skating</Badge>
                  <Badge>Traveling</Badge>
                  <Badge>Trains</Badge>
                  <Badge>Rock Climbing</Badge>
                  <Badge>Debate</Badge>
                  <Badge>Auto Detailing</Badge>
                  <Badge>Table Tennis</Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="talent" className="mt-0">
              <Suspense fallback={<TalentTabSkeleton />}>
                <TalentTab
                  address={preloadedQueryResult(preloadedUser).address}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="posts" className="mt-0">
              <Posts />
            </TabsContent>

            {/* <TabsContent value="events" className="mt-0">
              <UpcomingEvents />
            </TabsContent> */}
            <TabsContent value="certificates" className="mt-0">
              {/* Certifications Section */}
              <CertificationsSection preloadedUser={preloadedUser} />
            </TabsContent>

            <TabsContent value="more" className="mt-0">
              <div className="p-4 text-center text-gray-500">
                More content will appear here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
