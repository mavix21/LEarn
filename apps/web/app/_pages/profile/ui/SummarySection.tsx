"use client";

import type { Preloaded } from "convex/react";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, usePreloadedQuery } from "convex/react";
import { Check, Edit2, X } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";
import { Textarea } from "@skill-based/ui/components/textarea";

import { api } from "@/convex/_generated/api";

export function SummarySection({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.getUserProfile>;
}) {
  const { bio, isMe } = usePreloadedQuery(preloadedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio);
  const updateBio = useMutation(api.users.updateBio);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    await updateBio({ bio: editedBio });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedBio(bio);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Bio</h2>
        {isMe && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        {isMe && isEditing && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={handleSave}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={editedBio}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setEditedBio(e.target.value)
            }
            placeholder="Write something about yourself..."
            className="min-h-[100px] text-base"
          />
        ) : bio ? (
          <p className="min-h-[100px] rounded-md border py-2 pl-3">{bio}</p>
        ) : (
          <p className="italic">No bio provided.</p>
        )}
      </div>
    </div>
  );
}
