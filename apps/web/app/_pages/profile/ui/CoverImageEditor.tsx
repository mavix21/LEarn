"use client";

import type { Area } from "react-easy-crop";
import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Edit2 } from "lucide-react";

import { Button } from "@skill-based/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@skill-based/ui/components/dialog";

import type { Id } from "@/convex/_generated/dataModel";
import { deleteFile } from "@/src/storage/delete-file.action";
import { uploadFile } from "@/src/storage/upload-file.action";
import { updateCoverImage } from "@/src/users/update-cover-image.action";

const Cropper = dynamic(() => import("react-easy-crop"), { ssr: false });

interface CoverImageEditorProps {
  coverImageUrl: string | undefined;
  coverImageStorageId: Id<"_storage"> | undefined;
  isMe: boolean;
  onChange?: (dataUrl: string) => void;
}

export function CoverImageEditor({
  coverImageUrl,
  coverImageStorageId,
  isMe,
  onChange,
}: CoverImageEditorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImageSrc(reader.result as string),
      );
      reader.readAsDataURL(files[0]);
    }
  };

  const handleOpenModal = () => {
    if (coverImageUrl) {
      setImageSrc(coverImageUrl);
    }
    setModalOpen(true);
  };

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;
    const image = new window.Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
    );
    return canvas.toDataURL("image/jpeg");
  }, [imageSrc, croppedAreaPixels]);

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const [header, base64] = dataUrl.split(",");
    if (!header || !base64) throw new Error("Invalid data URL");
    const mime = /:(.*?);/.exec(header)?.[1] ?? "image/jpeg";
    const bstr = atob(base64);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleChangeImage = () => {
    setImageSrc(null);
    inputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      const croppedDataUrl = await getCroppedImg();
      if (!croppedDataUrl) return;

      // Delete existing image if there is one
      if (coverImageStorageId) {
        await deleteFile(coverImageStorageId);
      }

      // Convert data URL to File
      const file = dataURLtoFile(croppedDataUrl, "cover-image.jpg");

      // Upload file to Convex storage
      const { storageId } = await uploadFile(file);

      // Update user's cover image
      await updateCoverImage(storageId);

      if (onChange) onChange(croppedDataUrl);
      setModalOpen(false);
      setImageSrc(null);
    } catch (error) {
      console.error("Error uploading cover image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative h-48 w-full rounded-lg">
      <Image
        src={coverImageUrl ?? "/placeholder.svg"}
        alt="Profile cover image"
        fill
        className="object-cover"
      />
      {isMe && (
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="absolute right-4 top-4 z-20"
          onClick={handleOpenModal}
        >
          <Edit2 className="h-5 w-5" />
        </Button>
      )}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Edit Cover Image</DialogTitle>
          <div className="flex flex-col gap-4">
            {!imageSrc ? (
              <div className="flex flex-col items-center gap-2">
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onSelectFile}
                />
                <Button onClick={() => inputRef.current?.click()}>
                  Upload Image
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-muted relative h-64 w-full overflow-hidden rounded-md">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={10 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    rotation={0}
                    minZoom={1}
                    maxZoom={3}
                    cropShape="rect"
                    zoomSpeed={0.5}
                    restrictPosition={false}
                    style={{
                      containerStyle: {
                        width: "100%",
                        height: "100%",
                      },
                    }}
                    classes={{
                      containerClassName: "h-full w-full",
                    }}
                    mediaProps={{
                      src: imageSrc,
                    }}
                    cropperProps={{
                      style: {
                        width: "100%",
                        height: "100%",
                      },
                    }}
                    keyboardStep={1}
                  />
                </div>
                <Button variant="outline" onClick={handleChangeImage}>
                  Change Image
                </Button>
              </>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setModalOpen(false);
                  setImageSrc(null);
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              {imageSrc && (
                <Button onClick={handleSave} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Save"}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Overlay opacity for react-easy-crop */}
      <style jsx global>{`
        .reactEasyCrop_Overlay {
          background: rgba(0, 0, 0, 0.6) !important;
        }
      `}</style>
    </div>
  );
}
