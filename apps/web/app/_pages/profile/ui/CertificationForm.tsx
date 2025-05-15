"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchQuery } from "convex/nextjs";
import { useMutation, useQuery } from "convex/react";
import { File, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Badge } from "@skill-based/ui/components/badge";
import { Button } from "@skill-based/ui/components/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@skill-based/ui/components/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@skill-based/ui/components/form";
import { Input } from "@skill-based/ui/components/input";

import type { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { uploadFile } from "@/src/storage/upload-file.action";

const formSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuingCompany: z.string().min(1, "Issuing company is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  credentialId: z.string().optional(),
  credentialUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  mediaStorageId: z.custom<Id<"_storage">>().optional(),
  mediaType: z.enum(["image", "pdf"]).optional(),
  issueDate: z.string().optional(),
});

interface CertificationFormProps {
  certificationId: Id<"certifications"> | null;
  onCancel: () => void;
}

export function CertificationForm({
  certificationId,
  onCancel,
}: CertificationFormProps) {
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedStorageId, setUploadedStorageId] =
    useState<Id<"_storage"> | null>(null);
  const [, setUploadURL] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const deleteFile = useMutation(api.storage.deleteById);

  // Fetch certification if editing
  const certification = useQuery(
    api.certifications.get,
    certificationId ? { id: certificationId } : "skip",
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      issuingCompany: "",
      skills: [],
      credentialId: "",
      credentialUrl: "",
      mediaStorageId: undefined,
      mediaType: undefined,
      issueDate: "",
    },
  });

  const getFileUrl = useQuery(
    api.storage.getUrl,
    form.watch("mediaStorageId") && form.watch("mediaType") === "image"
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        { storageId: form.watch("mediaStorageId")! }
      : "skip",
  );

  const createCertification = useMutation(api.certifications.add);
  const updateCertification = useMutation(api.certifications.update);

  // Initialize form and preview when certification is loaded
  useEffect(() => {
    if (certification && !isInitialized) {
      form.reset({
        name: certification.name,
        issuingCompany: certification.issuingCompany,
        skills: certification.skills,
        credentialId: certification.credentialId,
        credentialUrl: certification.credentialUrl,
        mediaStorageId: certification.media.storageId,
        mediaType: certification.media.type,
        issueDate: certification.issueDate,
      });
      setUploadedStorageId(certification.media.storageId);
      setIsInitialized(true);
    }
  }, [certification, form, isInitialized]);

  // Set preview URL when editing an existing certification with media
  useEffect(() => {
    if (certification?.media.type === "image" && getFileUrl && !previewUrl) {
      setPreviewUrl(getFileUrl);
    }
  }, [certification?.media.type, getFileUrl, previewUrl]);

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = form.getValues("skills");
      if (!currentSkills.includes(skillInput.trim())) {
        form.setValue("skills", [...currentSkills, skillInput.trim()]);
        setSkillInput("");
      }
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = form.getValues("skills");
    form.setValue(
      "skills",
      currentSkills.filter((s) => s !== skill),
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please select an image or PDF file");
      return;
    }

    // Validate file size (1MB limit for Next.js server actions)
    if (file.size > 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const { storageId, uploadUrl } = await uploadFile(selectedFile);
      setUploadedStorageId(storageId);
      setUploadURL(uploadUrl);
      form.setValue("mediaStorageId", storageId);
      form.setValue(
        "mediaType",
        selectedFile.type.startsWith("image/") ? "image" : "pdf",
      );
      toast.success("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (uploadedStorageId) {
      try {
        await deleteFile({ storageId: uploadedStorageId });
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    setSelectedFile(null);
    setUploadedStorageId(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    form.setValue("mediaStorageId", undefined);
    form.setValue("mediaType", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle all dialog closing scenarios
  const handleDialogClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onCancel();
  };

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    try {
      const mediaStorageId = values.mediaStorageId;
      // Check if there's a selected file that hasn't been uploaded
      if (selectedFile && mediaStorageId === undefined) {
        toast.error("Please upload the selected file before saving");
        return;
      }

      if (!mediaStorageId) {
        toast.error("Please upload a proof of your certification");
        return;
      }

      // Prevent submission if file is currently uploading
      if (isUploading) {
        toast.error("Please wait for the file upload to complete");
        return;
      }

      setIsSubmitting(true);

      if (certificationId) {
        await updateCertification({
          id: certificationId,
          ...values,
        });

        toast.success("Certification updated successfully");
      } else {
        const { mediaStorageId, mediaType } = values;
        if (!mediaStorageId || !mediaType) {
          toast.error("Please upload a proof of your certification");
          return;
        }
        await createCertification({
          ...values,
          mediaStorageId,
          mediaType,
        });
        toast.success("Certification added successfully");
      }

      onCancel();
    } catch (error) {
      toast.error(
        certificationId
          ? "Failed to update certification"
          : "Failed to add certification",
      );
      console.error("Error saving certification:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)}>
        <DialogHeader>
          <DialogTitle>
            {certificationId ? "Edit Certification" : "Add New Certification"}
          </DialogTitle>
          <DialogDescription>
            Add details about your professional certification or credential.
          </DialogDescription>
        </DialogHeader>

        <div className="grid max-h-[75vh] gap-2 overflow-y-auto py-4 pl-0.5 pr-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  Certification Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., AWS Certified Solutions Architect"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issuingCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  Issuing Company <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Amazon Web Services" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">
                  Associated Skills <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
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
                    <Button
                      type="button"
                      onClick={handleAddSkill}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                </FormControl>
                {field.value.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value.map((skill) => (
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Issue Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="credentialId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Credential ID</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AWS-12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="credentialUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Credential URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com/verify"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mediaStorageId"
            render={() => (
              <FormItem>
                <FormLabel className="font-medium">
                  Multimedia Content
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0"
                      >
                        <File className="mr-2 h-4 w-4" />
                        Select File
                      </Button>
                      {selectedFile && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleFileUpload}
                          disabled={isUploading}
                        >
                          {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                    </div>
                    {selectedFile && (
                      <div className="text-muted-foreground text-sm">
                        Selected: {selectedFile.name}
                      </div>
                    )}
                    {previewUrl && (
                      <div className="relative aspect-auto h-56">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute right-2 top-2 z-10 h-8 w-8"
                          onClick={handleRemoveFile}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                        <Image
                          src={previewUrl}
                          alt="Preview"
                          fill
                          className="rounded-lg object-contain"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription>
                  Upload an image or PDF of your certificate (max 1MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting
              ? "Saving..."
              : certificationId
                ? "Save Changes"
                : "Add Certification"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
