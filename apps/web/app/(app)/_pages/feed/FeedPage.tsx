import Image from "next/image";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  PaperclipIcon as PaperClip,
  Repeat2,
  Triangle,
  User,
} from "lucide-react";

export function FeedPage() {
  return (
    <div
      className="bg-muted h-full overflow-y-auto px-4"
      style={{
        scrollbarGutter: "stable both-edges",
      }}
    >
      {/* Post Creation */}
      <div className="bg-background mx-auto max-w-xl border-x">
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
                  <MoreHorizontal size={20} className="text-muted-foreground" />
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
                  <MoreHorizontal size={20} className="text-muted-foreground" />
                </div>
                <p className="mt-1">
                  It took so long for this desktop version of Threads to come
                  out, but I'm really excited to start posting tips and content
                  directly from the computer
                </p>
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
      </div>
    </div>
  );
}
