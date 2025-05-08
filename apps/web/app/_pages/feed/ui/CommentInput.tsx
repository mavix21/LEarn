"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";
import { Textarea } from "@skill-based/ui/components/textarea";

export function CommentInput({
  onSend,
  postId,
}: {
  onSend?: (value: string, postId: string) => void;
  postId: string;
}) {
  const [value, setValue] = useState("");
  return (
    <form
      className="mt-3 flex w-full gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (onSend) onSend(value, postId);
        setValue("");
      }}
    >
      <Textarea
        placeholder="Escribe un comentario..."
        className="flex-1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={true}
      />
      <Button aria-label="Enviar comentario" type="submit" disabled={!value}>
        <SendHorizonal size={20} />
      </Button>
    </form>
  );
}
