"use client";

import type { Preloaded } from "convex/react";
import { useState } from "react";
import { useMutation, usePreloadedQuery } from "convex/react";
import { Edit2, X } from "lucide-react";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@skill-based/ui/components/dialog";
import { Input } from "@skill-based/ui/components/input";
import { Label } from "@skill-based/ui/components/label";
import { cn } from "@skill-based/ui/lib/utils";

import { api } from "@/convex/_generated/api";

const MAX_HOBBIES = 20;

export default function Hobbies({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.getUserProfile>;
}) {
  const { isMe, userId, hobbies } = usePreloadedQuery(preloadedUser);
  const updateHobbies = useMutation(api.users.updateHobbies);
  const [isOpen, setIsOpen] = useState(false);
  const [newHobby, setNewHobby] = useState("");
  const [localHobbies, setLocalHobbies] = useState<string[]>(hobbies);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddHobby = () => {
    if (!newHobby.trim()) return;
    if (localHobbies.length >= MAX_HOBBIES) return;
    if (localHobbies.includes(newHobby.trim())) return;

    setLocalHobbies((prev) => [...prev, newHobby.trim()]);
    setNewHobby("");
  };

  const handleRemoveHobby = (hobby: string) => {
    setLocalHobbies((prev) => prev.filter((h) => h !== hobby));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      await updateHobbies({ hobbies: localHobbies });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update hobbies:", error);
      // Reset to original hobbies on error
      setLocalHobbies(hobbies);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddHobby();
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Hobbies</h2>
        {isMe && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                <Edit2 className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Hobbies</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-4">
                    <Label htmlFor="hobby">Add a hobby</Label>
                    <Input
                      id="hobby"
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter a hobby"
                      disabled={localHobbies.length >= MAX_HOBBIES}
                    />
                  </div>
                  <Button
                    onClick={handleAddHobby}
                    disabled={
                      !newHobby.trim() ||
                      localHobbies.length >= MAX_HOBBIES ||
                      localHobbies.includes(newHobby.trim())
                    }
                    className="mt-auto"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localHobbies.map((hobby) => (
                    <Badge
                      key={hobby}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {hobby}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveHobby(hobby)}
                      >
                        <X className="size-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground text-sm">
                    {localHobbies.length}/{MAX_HOBBIES} hobbies
                  </p>
                  <Button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className={cn(isSubmitting && "opacity-50")}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {hobbies.map((hobby) => (
          <Badge key={hobby}>{hobby}</Badge>
        ))}
        {hobbies.length === 0 && (
          <p className="text-muted-foreground text-sm">No hobbies added yet</p>
        )}
      </div>
    </div>
  );
}
