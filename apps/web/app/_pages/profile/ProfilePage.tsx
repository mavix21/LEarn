import { Suspense } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  FileText,
  MoreHorizontal,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@skill-based/ui/components/avatar";
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

import { ProfileHeader } from "./ui/ProfileHeader";
import { TalentTab } from "./ui/TalentTab";
import { TalentTabSkeleton } from "./ui/TalentTabSkeleton";

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
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Summary Section */}
              <div className="space-y-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Bio</h2>
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
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-semibold">
                    Ask Me About
                    <Badge className="bg-muted ml-2 hover:bg-gray-300">
                      {user.topics.length}
                    </Badge>
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-green-600 hover:text-green-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {user.topics.length > 0 ? (
                    user.topics.map(({ topic, endorsements }, idx: number) => (
                      <div
                        key={topic || idx}
                        className="flex items-center border-b py-2"
                      >
                        <Check className="mr-2 h-5 w-5 text-green-500" />
                        <span className="flex-grow">{topic}</span>
                        {typeof endorsements === "number" && (
                          <Badge className="bg-muted">+{endorsements}</Badge>
                        )}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </div>
                    ))
                  ) : (
                    <div className="italic text-gray-400">
                      No topics added yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Groups Section */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Groups</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center rounded-lg border p-3">
                    <div className="mr-3 rounded-full bg-indigo-100 p-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">Group Name Here</h3>
                      <p className="text-sm text-gray-500">
                        Online Resource Group
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback>U3</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      817 Members
                    </span>
                  </div>

                  <div className="flex items-center rounded-lg border p-3">
                    <div className="mr-3 rounded-full bg-indigo-100 p-2">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">Group Name Here</h3>
                      <p className="text-sm text-gray-500">
                        Online Resource Group
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback>U1</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback>U2</AvatarFallback>
                      </Avatar>
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarFallback>U3</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      231 Members
                    </span>
                  </div>
                </div>
              </div>

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

              {/* Posts Section */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Posts</h2>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 text-blue-600 hover:text-blue-700"
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <h3 className="mb-1 font-medium">
                        Spotify $10 Evergreen Referral Incentive is Live!
                      </h3>
                      <p className="text-sm text-gray-500">James Harrison</p>
                      <p className="text-xs">Posted on February 1, 2021</p>
                    </div>
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-yellow-100">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Post thumbnail"
                        width={80}
                        height={80}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <h3 className="mb-1 font-medium">
                        Spotify $10 Evergreen Referral Incentive is Live!
                      </h3>
                      <p className="text-sm text-gray-500">Judith Nguyen</p>
                      <p className="text-xs">Posted on February 1, 2021</p>
                    </div>
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-pink-100">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Post thumbnail"
                        width={80}
                        height={80}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-grow">
                      <h3 className="mb-1 font-medium">
                        Spotify $10 Evergreen Referral Incentive is Live!
                      </h3>
                      <p className="text-sm text-gray-500">Aaron Cooper</p>
                      <p className="text-xs">Posted on February 1, 2021</p>
                    </div>
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-blue-100">
                      <Image
                        src="/placeholder.svg?height=80&width=80"
                        alt="Post thumbnail"
                        width={80}
                        height={80}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pages Section */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Pages</h2>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 text-blue-600 hover:text-blue-700"
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center py-2">
                    <div className="bg-muted mr-3 p-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">About Cirrus</h3>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <div className="bg-muted mr-3 p-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Async Resources</h3>
                      <p className="text-xs text-gray-500">Events</p>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <div className="bg-muted mr-3 p-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">COVID-19 Resources</h3>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <div className="bg-muted mr-3 p-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Culture & Workplace</h3>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events Section */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Upcoming Events</h2>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2 text-blue-600 hover:text-blue-700"
                    >
                      View All
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="overflow-hidden rounded-lg border">
                    <div className="relative h-32 bg-pink-100">
                      <Image
                        src="/placeholder.svg?height=128&width=300"
                        alt="Event thumbnail"
                        width={300}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute right-2 top-2 min-w-[40px] rounded-lg bg-white p-1 text-center">
                        <div className="text-lg font-bold">12</div>
                        <div className="text-xs text-gray-500">FEB</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="mb-1 text-xs text-gray-500">
                        Group Name
                      </div>
                      <h3 className="mb-1 text-sm font-medium">
                        Cirrus Lunch & Learn: Robinhood Crypto vs. COO 3rd
                        Headline Here
                      </h3>
                      <p className="mt-2 text-xs text-gray-500">2:30 PM PST</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border">
                    <div className="relative h-32 bg-purple-100">
                      <Image
                        src="/placeholder.svg?height=128&width=300"
                        alt="Event thumbnail"
                        width={300}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute right-2 top-2 min-w-[40px] rounded-lg bg-white p-1 text-center">
                        <div className="text-lg font-bold">27</div>
                        <div className="text-xs text-gray-500">FEB</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="mb-1 text-xs text-gray-500">
                        Group Name
                      </div>
                      <h3 className="mb-1 text-sm font-medium">Show & Tell</h3>
                      <p className="mt-2 text-xs text-gray-500">2:30 PM PST</p>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border">
                    <div className="relative h-32 bg-green-100">
                      <Image
                        src="/placeholder.svg?height=128&width=300"
                        alt="Event thumbnail"
                        width={300}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute right-2 top-2 min-w-[40px] rounded-lg bg-white p-1 text-center">
                        <div className="text-lg font-bold">4</div>
                        <div className="text-xs text-gray-500">MAR</div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="mb-1 text-xs text-gray-500">
                        Group Name
                      </div>
                      <h3 className="mb-1 text-sm font-medium">
                        Level 4: Asian Immigrants & Canadian Immigration Groups
                      </h3>
                      <p className="mt-2 text-xs text-gray-500">2:30 PM PST</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="talent" className="mt-0">
              <Suspense fallback={<TalentTabSkeleton />}>
                <TalentTab />
              </Suspense>
            </TabsContent>

            <TabsContent value="posts" className="mt-0">
              <div className="p-4 text-center text-gray-500">
                Posts content will appear here
              </div>
            </TabsContent>

            <TabsContent value="pages" className="mt-0">
              <div className="p-4 text-center text-gray-500">
                Pages content will appear here
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <div className="p-4 text-center text-gray-500">
                Events content will appear here
              </div>
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
