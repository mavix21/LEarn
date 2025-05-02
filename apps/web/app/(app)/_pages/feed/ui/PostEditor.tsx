"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMutation } from "convex/react";
import { SendHorizonal, User } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";

import "./styles.css";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export function PostEditor() {
  const createPost = useMutation(api.posts.createPost);
  const editor = useEditor({
    immediatelyRender: true,
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write something cool today",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  async function onSubmit() {
    await createPost({
      content: input,
      authorId: "j97f00n7t41er945tbhn0ddw057f466f" as Id<"users">,
      authorAddress: "0x4029490B2Dedd37906F2911B444d081caAad8E71",
    }).catch((error) => {
      console.error("Failed to create post:", error);
    });

    editor?.commands.clearContent();
  }

  return (
    <div className="border-b p-4">
      <div className="flex items-start gap-3">
        <User className="text-muted-foreground" size={20} />
        <div className="flex-1">
          {/* <p className="text-muted-foreground">
                  Share something cool today
                </p> */}
          <EditorContent
            editor={editor}
            className="bg-background max-h-[20rem] w-full overflow-y-auto"
          />
        </div>

        <Button
          size="icon"
          variant="ghost"
          onClick={onSubmit}
          disabled={!input.trim()}
        >
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send post</span>
        </Button>
      </div>
    </div>
  );
}
