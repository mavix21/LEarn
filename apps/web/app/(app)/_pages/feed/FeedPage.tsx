"use client";

import { useQuery } from "convex/react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Triangle,
  User,
} from "lucide-react";

import { api } from "@/convex/_generated/api";

import { Post, PostEditor } from "./ui";

export function FeedPage() {
  // const [post, setPost] = useState("");
  // const [attachments, setAttachments] = useState<File[]>([]);
  // const createPost = useMutation(api.posts.createPost);

  // const handleAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const newFiles = Array.from(e.target.files);
  //     setAttachments((prev) => [...prev, ...newFiles]);
  //   }
  // };

  // const removeAttachment = (index: number) => {
  //   setAttachments((prev) => prev.filter((_, i) => i !== index));
  // };

  // const handleSubmit = async () => {
  //   if (post.trim() || attachments.length > 0) {
  //     console.log("Submitting post:", post);
  //     console.log("Attachments:", attachments);

  //     await createPost({
  //       content: post,
  //       authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
  //       authorAddress: "0x4029490B2Dedd37906F2911B444d081caAad8E71",
  //     }).catch((error) => {
  //       console.error("Failed to create post:", error);
  //     });

  //     // Here you would typically send the post to your backend
  //     setPost("");
  //     setAttachments([]);
  //   }
  // };

  const posts = useQuery(api.posts.getPosts);

  return (
    <div
      className="bg-muted h-full overflow-y-auto px-4"
      style={{
        scrollbarGutter: "stable both-edges",
      }}
    >
      {/* Post Creation */}
      <div className="bg-background mx-auto max-w-xl border-x">
        <PostEditor />

        {/* Posts */}
        {posts?.map((post) => <Post key={post._id} content={post.content} />)}
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
