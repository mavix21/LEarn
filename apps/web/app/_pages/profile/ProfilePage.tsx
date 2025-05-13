import { Suspense } from "react";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
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

import { AskMeAbout } from "./ui/AskMeAbout";
import { CertificationsSection } from "./ui/CertificationsSection";
import { Groups } from "./ui/Groups";
import { Posts } from "./ui/Posts";
import { ProfileHeader } from "./ui/ProfileHeader";
import { TalentTab } from "./ui/TalentTab";
import { TalentTabSkeleton } from "./ui/TalentTabSkeleton";
import UpcomingEvents from "./ui/UpcomingEvents";

export async function ProfilePage({ userId }: { userId: string }) {
  const data = await auth();
  if (!data) redirect("/feed");

  const { address, convexToken: token } = data;

  const user = await fetchQuery(
    api.users.getUserProfile,
    {
      userId: userId as Id<"users">,
    },
    { token },
  );

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="bg-card container mx-auto h-full max-w-6xl space-y-6 overflow-y-auto">
      <ProfileHeader
        name={user.name}
        title={user.title}
        location={user.location}
        avatarUrl={user.avatarUrl}
        address={address}
      />

      <div className="px-5">
        {/* Main Content */}
        <div className="w-full">
          <Tabs defaultValue="overview" className="w-full space-y-8">
            <TabsList className="w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="talent">Talent</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Summary Section */}
              <div className="space-y-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Bio</h2>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-muted-foreground space-y-2">
                  {user.bio ? (
                    <p>{user.bio}</p>
                  ) : (
                    <p className="italic text-gray-400">No bio provided.</p>
                  )}
                </div>
              </div>

              {/* Ask Me About Section */}
              <div className="mb-8">
                <AskMeAbout topics={user.topics} />
              </div>

              {/* Certifications Section */}
              <CertificationsSection />

              {/* Groups Section */}
              <Groups />

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
                <TalentTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="posts" className="mt-0">
              <Posts />
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <UpcomingEvents />
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
