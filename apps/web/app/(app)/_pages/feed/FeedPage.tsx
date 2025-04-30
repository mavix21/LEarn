import Image from "next/image";
import {
  Asterisk,
  Bookmark,
  Heart,
  Home,
  MessageCircle,
  MoreHorizontal,
  PaperclipIcon as PaperClip,
  Repeat2,
  Search,
  Settings,
  Triangle,
  User,
} from "lucide-react";

import { ProfileCard } from "@/app/(app)/_pages/feed/ui";

export function FeedPage() {
  return (
    <div className="grid h-svh grid-cols-1 grid-rows-[3rem_1fr] lg:grid-cols-[1fr_2fr_1fr]">
      {/* <div className="row-start-1 bg-red-500 p-6"></div> */}
      <div className="col-span-1 col-start-1 row-start-1 hidden items-center justify-center gap-2 border-b lg:flex">
        <Asterisk />
        <span className="font-semibold">SkillBased</span>
      </div>

      <div className="col-span-1 col-start-3 row-start-1 hidden items-center justify-center gap-2 border-b lg:flex">
        <Asterisk />
      </div>

      <div className="row-start-2 mx-auto hidden max-w-xs lg:block">
        <ProfileCard />
      </div>

      {/* Main Content */}
      <div className="col-start-1 row-span-2 row-start-1 flex h-svh flex-1 flex-col-reverse justify-center overflow-hidden border-x lg:col-start-2 lg:flex-col">
        {/* Top Navigation */}
        <div className="flex h-12 items-center justify-center gap-8 border-t p-4 backdrop-blur-sm lg:border-b">
          <Home />
          <Search />
          <Heart />
          <Triangle />
          <Bookmark />
        </div>

        <div className="mx-auto h-full max-w-xl overflow-y-auto border-x lg:max-w-full lg:border-x-0">
          {/* Post Creation */}
          <div className="border-b p-4">
            <div className="flex items-start gap-3">
              <User className="text-muted-foreground" size={20} />
              <div className="flex-1">
                <p className="text-muted-foreground">
                  Share something cool today
                </p>
                <div className="mt-2">
                  <PaperClip className="text-muted-foreground" size={20} />
                </div>
              </div>
              <Triangle className="text-muted-foreground" size={20} />
            </div>
          </div>
          {/* Posts */}
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
                        2min
                      </span>
                    </div>
                    <MoreHorizontal
                      size={20}
                      className="text-muted-foreground"
                    />
                  </div>
                  <p className="mt-1">
                    I am excited to share with you my latest projects
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="overflow-hidden rounded-lg bg-purple-300">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Project image"
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden rounded-lg bg-purple-800">
                      <Image
                        src="/placeholder.svg?height=300&width=300"
                        alt="Project image"
                        width={300}
                        height={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Heart size={20} className="text-muted-foreground" />
                    <MessageCircle
                      size={20}
                      className="text-muted-foreground"
                    />
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
          {/* Second Post */}
          <div className="border-b">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <User className="text-muted-foreground" size={20} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">arochinski</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        2min
                      </span>
                    </div>
                    <MoreHorizontal
                      size={20}
                      className="text-muted-foreground"
                    />
                  </div>
                  <p className="mt-1">
                    It took so long for this desktop version of Threads to come
                    out, but I'm really excited to start posting tips and
                    content directly from the computer
                  </p>
                  <div className="mt-4 flex gap-4">
                    <Heart size={20} className="text-muted-foreground" />
                    <MessageCircle
                      size={20}
                      className="text-muted-foreground"
                    />
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
        </div>
      </div>

      {/* Right Sidebar - Trending */}
      <div className="row-start-2 hidden max-w-xs p-6 lg:block">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Trending Topics</h2>
          <Settings size={20} className="text-muted-foreground" />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground text-xs">DESIGN</p>
            <p className="font-medium">ThreadsDesktop</p>
            <p className="text-muted-foreground text-xs">123.9k threads</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">MOVIES AND SERIES</p>
            <p className="font-medium">Spider-Man: Across the Spider-Verse</p>
            <p className="text-muted-foreground text-xs">93.4k threads</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">TECH</p>
            <p className="font-medium">iPhone 15</p>
            <p className="text-muted-foreground text-xs">85.2k threads</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">GAMES</p>
            <p className="font-medium">Riot Games</p>
            <p className="text-muted-foreground text-xs">71.9k threads</p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">DESIGN</p>
            <p className="font-medium">#Minimalism</p>
            <p className="text-muted-foreground text-xs">69.1k threads</p>
          </div>

          <p className="text-sm text-blue-400">see more</p>
        </div>
      </div>
      {/* Left Sidebar - Profile */}
    </div>
  );
}
