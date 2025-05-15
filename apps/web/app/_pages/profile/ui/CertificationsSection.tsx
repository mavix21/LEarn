"use client";

import type { Preloaded } from "convex/react";
import { useState } from "react";
import { useMutation, usePreloadedQuery, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@skill-based/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@skill-based/ui/components/dialog";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

import { CertificationCard } from "./CertificationCard";
import { CertificationForm } from "./CertificationForm";

export function CertificationsSection({
  preloadedUser,
}: {
  preloadedUser: Preloaded<typeof api.users.getUserProfile>;
}) {
  const { userId, address, isMe } = usePreloadedQuery(preloadedUser);

  const [open, setOpen] = useState(false);
  const [editingCertificationId, setEditingCertificationId] =
    useState<Id<"certifications"> | null>(null);

  // Fetch certifications
  const certifications = useQuery(api.certifications.list, {
    userId,
  });
  const removeCertification = useMutation(api.certifications.remove);

  const handleAddCertification = () => {
    setEditingCertificationId(null);
    setOpen(true);
  };

  const handleEditCertification = (id: Id<"certifications">) => {
    setEditingCertificationId(id);
    setOpen(true);
  };

  const handleDeleteCertification = async (id: Id<"certifications">) => {
    try {
      await removeCertification({ id });
      toast.success("Certification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete certification");
      console.error("Error deleting certification:", error);
    }
  };

  if (certifications === undefined) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="text-muted-foreground">Loading certifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Certifications</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          {isMe && (
            <DialogTrigger asChild>
              <Button onClick={handleAddCertification}>
                <Plus className="mr-2 h-4 w-4" />
                Add Certification
              </Button>
            </DialogTrigger>
          )}
          <DialogContent className="sm:max-w-[550px]">
            <CertificationForm
              certificationId={editingCertificationId}
              onCancel={() => {
                setOpen(false);
                setEditingCertificationId(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {certifications.length === 0 ? (
        <div className="bg-background flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
          <h3 className="text-lg font-medium">No certifications added yet</h3>
          <p className="text-muted-foreground text-sm">
            Add your professional certifications to showcase your skills and
            credentials.
          </p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleAddCertification}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <CertificationForm
                certificationId={editingCertificationId}
                onCancel={() => {
                  setOpen(false);
                  setEditingCertificationId(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(264px,100%),1fr))] grid-rows-[1fr_auto_auto_auto_3.5rem] gap-4">
          {certifications.map((certification) => (
            <CertificationCard
              key={certification._id}
              certification={certification}
              mintRecipient={address}
              onEdit={() => handleEditCertification(certification._id)}
              onDelete={() => handleDeleteCertification(certification._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
