"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

type ImageUploadFieldProps = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
};

export function ImageUploadField({
  value,
  error,
  onChange,
  onRemove,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const onSelect = (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file", { position: "top-right" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onClearImage = () => {
    onRemove?.();
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
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          onSelect(event.dataTransfer.files?.[0]);
        }}
        className={`rounded border p-4 transition-colors ${
          dragOver ? "border-[#155DFC] bg-blue-50" : "border-gray-200"
        }`}
      >
        {value ? (
          <div className="relative h-52 w-full overflow-hidden border border-gray-200 bg-gray-50 sm:h-56 sm:w-72">
            <Image
              src={value}
              alt="Exam image preview"
              fill
              unoptimized
              className="object-cover"
              sizes="288px"
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
              <UploadCloud className="h-6 w-6" />
            </div>
            <p className="text-xs sm:text-sm">
              Drop an image here or{" "}
              <button
                type="button"
                className="text-[#155DFC] hover:underline"
                onClick={() => inputRef.current?.click()}
              >
                select from your computer
              </button>
            </p>
          </div>
        )}
      </div>

      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
