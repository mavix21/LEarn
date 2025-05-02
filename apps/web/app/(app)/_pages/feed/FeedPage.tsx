"use client";

import { useState } from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import {
  File,
  Heart,
  MessageCircle,
  MoreHorizontal,
  PaperclipIcon as PaperClip,
  Repeat2,
  SendHorizonal,
  Triangle,
  User,
  X,
} from "lucide-react";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import { Textarea } from "@skill-based/ui/components/textarea";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export function FeedPage() {
  const [post, setPost] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const createPost = useMutation(api.posts.createPost);

  const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (post.trim() || attachments.length > 0) {
      console.log("Submitting post:", post);
      console.log("Attachments:", attachments);

      createPost({
        content: post,
        authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
        authorAddress: "0x4029490B2Dedd37906F2911B444d081caAad8E71",
      }).catch((error) => {
        console.error("Failed to create post:", error);
      });

      // Here you would typically send the post to your backend
      setPost("");
      setAttachments([]);
    }
  };

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
              {/* <p className="text-muted-foreground">
                Share something cool today
              </p> */}
              <Textarea
                value={post}
                onChange={(e) => {
                  setPost(e.target.value);
                  // Auto-resize the textarea
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                placeholder="Share something cool today"
                className="max-h-[200px] min-h-[40px] flex-1 resize-none overflow-y-auto border-none py-2 shadow-none focus-visible:ring-0"
                rows={1}
                // onFocus={(e) => {
                //   // Set initial height on focus
                //   e.target.style.height = "auto";
                //   e.target.style.height = `${e.target.scrollHeight}px`;
                // }}
              />

              {attachments.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {attachments.map((file, index) => (
                    <div key={index} className="group relative">
                      {file.type.startsWith("image/") ? (
                        <div className="bg-muted relative aspect-square overflow-hidden rounded-md border">
                          <Image
                            src={
                              URL.createObjectURL(file) || "/placeholder.svg"
                            }
                            alt={file.name}
                            className="h-full w-full object-cover"
                            width={10}
                            height={10}
                          />
                        </div>
                      ) : (
                        <div className="bg-muted flex aspect-square flex-col items-center justify-center rounded-md border p-2">
                          <File className="text-muted-foreground h-8 w-8" />
                          <span className="mt-1 w-full truncate text-center text-xs">
                            {file.name}
                          </span>
                        </div>
                      )}
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute -right-2 -top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove attachment</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center gap-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <PaperClip className="text-muted-foreground hover:text-foreground h-5 w-5 transition-colors" />
                  <span className="sr-only">Attach files</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleAttachment}
                  />
                </label>

                {attachments.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {attachments.length}{" "}
                    {attachments.length === 1 ? "file" : "files"}
                  </Badge>
                )}
              </div>
            </div>
            {/* <SendHorizonal className="text-muted-foreground" size={20} /> */}

            <Button
              size="icon"
              variant="ghost"
              onClick={handleSubmit}
              disabled={!post.trim()}
            >
              <SendHorizonal className="h-5 w-5" />
              <span className="sr-only">Send post</span>
            </Button>
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
