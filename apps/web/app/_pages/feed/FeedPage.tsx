"use client";

import { useQuery } from "convex/react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@skill-based/ui/components/tabs";

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

        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            {posts?.map((post) => (
              <Post
                key={post._id}
                content={post.content}
                creationTime={post._creationTime}
              />
            ))}
          </TabsContent>
          <TabsContent value="following">
            Change your password here.
          </TabsContent>
        </Tabs>
        {/* Posts */}

        {/* Second Post */}
      </div>
    </div>
  );
}
