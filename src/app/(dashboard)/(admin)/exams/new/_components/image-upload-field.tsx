"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { uploadExamImage } from "../_actions/upload-exam-image.actions";

type ImageUploadFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
  onUploadingChange?: (isUploading: boolean) => void;
};

export function ImageUploadField({
  value,
  error,
  onChange,
  onRemove,
  onUploadingChange,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [previewIndex, setPreviewIndex] = useState(0);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");

  const onSelect = async (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    setUploadError("");
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    const nextPreviewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(nextPreviewUrl);
    setIsUploading(true);
    onUploadingChange?.(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadExamImage(formData);
      const imageUrl = result?.url;

      if (!imageUrl) {
        setUploadError("Failed to upload image");
        return;
      }

      onChange(imageUrl);
      setUploadError("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";
      setUploadError(message);
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const previewSources = useMemo(() => {
    if (!value) return [];

    const raw = value.trim().replace(/^['"]|['"]$/g, "");
    if (!raw) return [];

    if (
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("data:")
    ) {
      return [raw];
    }

    const apiBase = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
    const unique = new Set<string>([raw]);

    if (apiBase) {
      unique.add(`${apiBase}${raw.startsWith("/") ? raw : `/${raw}`}`);

      try {
        const apiOrigin = new URL(apiBase).origin;

        if (raw.startsWith("/api/")) {
          unique.add(`${apiOrigin}${raw}`);
        } else if (raw.startsWith("/upload/")) {
          unique.add(`${apiOrigin}/api${raw}`);
        } else if (raw.startsWith("api/")) {
          unique.add(`${apiOrigin}/${raw}`);
        } else {
          unique.add(`${apiOrigin}${raw.startsWith("/") ? raw : `/${raw}`}`);
        }
      } catch {
        // Ignore URL parsing fallback.
      }
    }

    return Array.from(unique);
  }, [value]);

  useEffect(() => {
    setPreviewIndex(0);
  }, [value]);

  const previewSrc = localPreviewUrl || previewSources[previewIndex] || "";
  const hasPreview = Boolean(localPreviewUrl || value);

  const onClearImage = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl("");
    }
    onRemove?.();
    setUploadError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">Image</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => onSelect(event.target.files?.[0])}
        disabled={isUploading}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isUploading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          if (!isUploading) {
            onSelect(event.dataTransfer.files?.[0]);
          }
        }}
        className={`rounded border p-4 transition-colors ${
          dragOver ? "border-[#155DFC] bg-blue-50" : "border-gray-200"
        } ${isUploading ? "opacity-60" : ""}`}
      >
        {hasPreview ? (
          <div className="relative h-52 w-full overflow-hidden border border-gray-200 bg-gray-50 sm:h-56 sm:w-72">
            <Image
              src={previewSrc}
              alt="Exam image preview"
              fill
              unoptimized
              className="object-cover"
              sizes="288px"
              onError={() => {
                if (localPreviewUrl) {
                  setUploadError("Image selected successfully, but remote preview is unavailable");
                  return;
                }

                if (previewIndex < previewSources.length - 1) {
                  setPreviewIndex((current) => current + 1);
                  return;
                }

                setUploadError("Image uploaded, but preview URL could not be loaded");
              }}
            />

            <button
              type="button"
              onClick={onClearImage}
              className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded bg-white/95 text-red-500 shadow hover:bg-white"
              aria-label="Remove uploaded image"
              title="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3 text-gray-500 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex h-11 w-11 items-center justify-center rounded border border-gray-200 text-gray-300">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <UploadCloud className="h-6 w-6" />
              )}
            </div>
            <p className="text-xs sm:text-sm">
              {isUploading ? (
                "Uploading image..."
              ) : (
                <>
                  Drop an image here or{" "}
                  <button
                    type="button"
                    className="text-[#155DFC] hover:underline"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                  >
                    select from your computer
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      {!error && uploadError ? (
        <p className="mt-1 text-xs text-red-500">{uploadError}</p>
      ) : null}
    </div>
  );
}
