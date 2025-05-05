"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useMutation } from "convex/react";
import { SendHorizonal, User, Paperclip } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import { Button } from "@skill-based/ui/components/button";

import "./post-editor.module.css";

import { api } from "@/convex/_generated/api";

export function PostEditor() {
  const createPost = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (selectedImages.length + acceptedFiles.length > 2) {
      alert("You can only attach up to 2 images.");
      return;
    }
    setSelectedImages((prev) => [...prev, ...acceptedFiles].slice(0, 2));
  }, [selectedImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 2,
    noClick: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (selectedImages.length + files.length > 2) {
      alert("You can only attach up to 2 images.");
      return;
    }
    setSelectedImages((prev) => [...prev, ...files].slice(0, 2));
  };

  const removeImage = (idx: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  async function uploadImage(file: File): Promise<string> {
    const uploadUrl = await generateUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await res.json();
    // Get the public URL for the image
    return `/api/storage/${storageId}`;
  }

  async function onSubmit() {
    setUploading(true);
    let imageUrls: string[] = [];
    try {
      if (selectedImages.length > 0) {
        imageUrls = await Promise.all(selectedImages.map(uploadImage));
      }
      await createPost({
        content: input,
        attachments: imageUrls,
      });
      editor?.commands.clearContent();
      setSelectedImages([]);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="bg-background space-y-2 rounded-xl p-4 shadow-md">
      <div className="flex gap-3">
        <div className="bg-muted rounded-full p-2 h-10">
          <User className="text-muted-foreground" />
        </div>
        <div className="flex-1" {...getRootProps()}>
          <input {...getInputProps()} />
          <EditorContent
            editor={editor}
            className="bg-muted max-h-80 w-full overflow-y-auto rounded-xl p-2"
          />
          <div className="mt-2 flex gap-2">
            {selectedImages.map((file, idx) => (
              <div key={idx} className="relative">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  width={64}
                  height={64}
                  className="rounded object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={() => removeImage(idx)}
                >
                  ×
                </Button>
              </div>
            ))}
            {/* {selectedImages.length < 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-16 w-16 flex items-center justify-center"
              >
                +
              </Button>
            )} */}
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={selectedImages.length >= 2}
            />
          </div>
          {isDragActive && (
            <div className="mt-2 rounded border-2 border-dashed border-primary p-4 text-center text-primary">
              Drop images here
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          {selectedImages.length < 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-10 w-10 flex items-center justify-center"
            >
              <Paperclip className="size-5" />
              <span className="sr-only">Attach image</span>
            </Button>
          )}
          <Button onClick={onSubmit} disabled={!input.trim() || uploading}>
            <SendHorizonal className="size-4" />
            <span className="sr-only">Send post</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
