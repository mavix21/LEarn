"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@skill-based/ui/components/dialog";

import type { Certification } from "../model/credential";
import { CertificationCard } from "./CertificationCard";
import { CertificationForm } from "./CertificationForm";

export default function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuingCompany: "Amazon Web Services",
      skills: ["AWS", "Cloud Architecture", "Infrastructure"],
      credentialId: "AWS-ASA-123456",
      credentialUrl: "https://aws.amazon.com/verification",
      issueDate: "2023-05-15",
    },
    {
      id: "2",
      name: "Professional Scrum Master I",
      issuingCompany: "Scrum.org",
      skills: ["Agile", "Scrum", "Project Management"],
      credentialId: "PSM-I-987654",
      credentialUrl: "https://www.scrum.org/certificates",
      issueDate: "2022-11-30",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingCertification, setEditingCertification] =
    useState<Certification | null>(null);

  const handleAddCertification = (certification: Omit<Certification, "id">) => {
    if (editingCertification) {
      setCertifications(
        certifications.map((cert) =>
          cert.id === editingCertification.id
            ? { ...certification, id: cert.id }
            : cert,
        ),
      );
    } else {
      setCertifications([
        ...certifications,
        { ...certification, id: Date.now().toString() },
      ]);
    }
    setOpen(false);
    setEditingCertification(null);
  };

  const handleDeleteCertification = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id));
  };

  const handleEditCertification = (certification: Certification) => {
    setEditingCertification(certification);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Certifications</h2>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCertification(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <CertificationForm
              onSubmit={handleAddCertification}
              initialData={editingCertification ?? undefined}
              onCancel={() => {
                setOpen(false);
                setEditingCertification(null);
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
                onClick={() => setEditingCertification(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <CertificationForm
                onSubmit={handleAddCertification}
                initialData={editingCertification ?? undefined}
                onCancel={() => {
                  setOpen(false);
                  setEditingCertification(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,100%),1fr)] gap-4">
          {certifications.map((certification) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              onEdit={handleEditCertification}
              onDelete={handleDeleteCertification}
            />
          ))}
        </div>
      )}
    </div>
  );
}
