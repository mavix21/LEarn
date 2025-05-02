import Image from "next/image";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Edit2,
  FileText,
  Globe,
  Mail,
  MoreHorizontal,
  Twitter,
  Users,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@skill-based/ui/components/avatar";
import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skill-based/ui/components/tabs";

export function ProfilePage() {
  return (
    <div className="container mx-auto h-full max-w-6xl space-y-6 overflow-y-auto">
      {/* Profile Header */}
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

        {/* Profile Info */}
        <div className="space-y-4 px-4">
          <div className="relative z-10 -mt-24 flex flex-col gap-4 md:-mt-14 md:flex-row md:items-end">
            <Avatar className="border-primary size-32 rounded-full border-4">
              <AvatarImage
                src="/placeholder.svg?height=128&width=128"
                alt="Assaf Rappaport"
              />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div className="-mt-4 flex-grow">
              <h1 className="text-2xl font-bold">Assaf Rappaport</h1>
              <p className="text-muted-foreground">VP of Customer Operations</p>
              <p className="text-muted-foreground/50 mt-1 text-sm">
                San Francisco, CA USA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="text-muted-foreground h-5 w-5" />
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

      <div className="px-4">
        {/* Main Content */}
        <div className="w-full">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="more">More</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              {/* Summary Section */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Summary</h2>
                  <Button variant="ghost" size="sm" className="p-1">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                </div>
              </div>

              {/* Ask Me About Section */}
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-semibold">
                    Ask Me About
                    <Badge className="ml-2 bg-gray-200 text-gray-700 hover:bg-gray-300">
                      8
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
                  <div className="flex items-center border-b py-2">
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <span className="flex-grow text-gray-800">
                      A Very Long Example Text Here
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+2</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      A Very Long Example
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+3</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Example
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+5</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Human Resources
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+3</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Medium Length
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+1</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Lost Text
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+2</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Analytics
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+4</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Interaction Design
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+3</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Example
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+3</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex items-center border-b py-2">
                    <span className="ml-7 flex-grow text-gray-800">
                      Interface Design
                    </span>
                    <Badge className="bg-gray-200 text-gray-700">+5</Badge>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </div>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-green-600 hover:text-green-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Dogs
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Football
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Basketball
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    The Witcher
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Ice Skating
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Traveling
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Trains
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Rock Climbing
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Debate
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Auto Detailing
                  </Badge>
                  <Badge className="bg-gray-100 px-3 py-1 text-gray-800 hover:bg-gray-200">
                    Table Tennis
                  </Badge>
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
                      <p className="text-xs text-gray-400">
                        Posted on February 1, 2021
                      </p>
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
                      <p className="text-xs text-gray-400">
                        Posted on February 1, 2021
                      </p>
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
                      <p className="text-xs text-gray-400">
                        Posted on February 1, 2021
                      </p>
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
                    <div className="mr-3 bg-gray-200 p-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">About Cirrus</h3>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <div className="mr-3 bg-gray-200 p-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Async Resources</h3>
                      <p className="text-xs text-gray-500">Events</p>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <div className="mr-3 bg-gray-200 p-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">COVID-19 Resources</h3>
                      <p className="text-xs text-gray-500">Documents</p>
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <div className="mr-3 bg-gray-200 p-2">
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

            <TabsContent value="groups" className="mt-0">
              <div className="p-4 text-center text-gray-500">
                Groups content will appear here
              </div>
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
