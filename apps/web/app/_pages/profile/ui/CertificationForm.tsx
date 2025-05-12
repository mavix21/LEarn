"use client";

import { useState } from "react";
import { File, X } from "lucide-react";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@skill-based/ui/components/dialog";
import { Input } from "@skill-based/ui/components/input";
import { Label } from "@skill-based/ui/components/label";

import type { Certification } from "../model/credential";

interface CertificationFormProps {
  onSubmit: (certification: Omit<Certification, "id">) => void;
  onCancel: () => void;
  initialData?: Certification;
}

export function CertificationForm({
  onSubmit,
  onCancel,
  initialData,
}: CertificationFormProps) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [issuingCompany, setIssuingCompany] = useState(
    initialData?.issuingCompany ?? "",
  );
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(initialData?.skills ?? []);
  const [credentialId, setCredentialId] = useState(
    initialData?.credentialId ?? "",
  );
  const [credentialUrl, setCredentialUrl] = useState(
    initialData?.credentialUrl ?? "",
  );
  const [mediaUrl, setMediaUrl] = useState(initialData?.mediaUrl ?? "");
  const [issueDate, setIssueDate] = useState(initialData?.issueDate ?? "");

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      issuingCompany,
      skills,
      credentialId,
      credentialUrl,
      mediaUrl,
      issueDate,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {initialData ? "Edit Certification" : "Add New Certification"}
        </DialogTitle>
        <DialogDescription>
          Add details about your professional certification or credential.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="font-medium">
            Certification Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., AWS Certified Solutions Architect"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="issuingCompany" className="font-medium">
            Issuing Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="issuingCompany"
            value={issuingCompany}
            onChange={(e) => setIssuingCompany(e.target.value)}
            placeholder="e.g., Amazon Web Services"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="skills" className="font-medium">
            Associated Skills <span className="text-destructive">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="skills"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g., Cloud Computing"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <Button type="button" onClick={handleAddSkill} variant="secondary">
              Add
            </Button>
          </div>
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:bg-muted ml-1 rounded-full"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {skill}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="issueDate" className="font-medium">
            Issue Date
          </Label>
          <Input
            id="issueDate"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="credentialId" className="font-medium">
            Credential ID
          </Label>
          <Input
            id="credentialId"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            placeholder="e.g., AWS-12345"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="credentialUrl" className="font-medium">
            Credential URL
          </Label>
          <Input
            id="credentialUrl"
            type="url"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            placeholder="https://example.com/verify"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="mediaUrl" className="font-medium">
            Multimedia Content
          </Label>
          <div className="flex gap-2">
            <Input
              id="mediaUrl"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Upload or enter URL for certificate image/PDF"
            />
            <Button type="button" variant="outline" className="shrink-0">
              <File className="h-4 w-4" />
              <span className="sr-only">Upload file</span>
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Upload an image or PDF of your certificate or enter a URL
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Save Changes" : "Add Certification"}
        </Button>
      </DialogFooter>
    </form>
  );
}
