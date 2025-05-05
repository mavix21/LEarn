"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMutation } from "convex/react";
import { SendHorizonal, SendIcon, User } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";

import "./post-editor.module.css";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

export function PostEditor() {
  const createPost = useMutation(api.posts.createPost);
  const editor = useEditor({
    immediatelyRender: false,
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
    }) ?? "";

  async function onSubmit() {
    await createPost({
      content: input,
    }).catch((error) => {
      console.error("Failed to create post:", error);
    });

    editor?.commands.clearContent();
  }

  return (
    <div className="bg-background space-y-2 rounded-xl p-4 shadow-md">
      <div className="flex gap-3">
        <div className="bg-muted rounded-full p-2">
          <User className="text-muted-foreground" />
        </div>
        <EditorContent
          editor={editor}
          className="bg-muted max-h-80 w-full overflow-y-auto rounded-xl p-2"
        />
        {/* <div className="flex-1">
          <p className="text-muted-foreground">
                  Share something cool today
                </p>
        </div> */}
      </div>
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={!input.trim()}>
          <SendHorizonal className="size-4" />
          <span className="sr-only">Send post</span>
        </Button>
      </div>
    </div>
  );
}
