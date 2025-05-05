"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { MessageCircle, SendHorizonal } from "lucide-react";

import { Input } from "@skill-based/ui/components/input";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface CommentSectionProps {
  postId: string;
  showInput: boolean;
  setShowInput: (show: boolean) => void;
}

export function CommentSection({
  postId,
  showInput,
  setShowInput,
}: CommentSectionProps) {
  // Puedes seguir usando los hooks para comentarios si los necesitas
  // const comments = useQuery(api.comments.getComments, {
  //   postId: postId as Id<"posts">,
  // });
  // const createComment = useMutation(api.comments.createComment);

  return (
    <button
      onClick={() => setShowInput(!showInput)}
      className={`flex items-center transition-colors hover:text-blue-500 ${
        showInput ? "fill-blue-500 text-blue-500" : "text-muted-foreground"
      }`}
      type="button"
      aria-label="Comentar"
    >
      <MessageCircle size={20} />
    </button>
  );
}

export function CommentInput({ onSend }: { onSend?: (value: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      className="mt-3 flex w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSend) onSend(value);
        setValue("");
      }}
    >
      <Input
        placeholder="Escribe un comentario..."
        className="flex-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className="text-blue-500 hover:text-blue-600"
        type="submit"
        aria-label="Enviar comentario"
      >
        <SendHorizonal size={20} />
      </button>
    </form>
  );
}
