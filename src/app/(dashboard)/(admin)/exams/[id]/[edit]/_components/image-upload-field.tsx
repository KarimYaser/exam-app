"use client";

import { useRef } from "react";
import Image from "next/image";
import { Download, Trash2 } from "lucide-react";

type ImageUploadFieldProps = {
  image: string;
  onChangeImage: (image: string) => void;
};

export default function ImageUploadField({
  image,
  onChangeImage,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onChangeImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">Image</label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleSelectFile(e.target.files?.[0])}
      />

      <div className="rounded border border-gray-200 bg-[#f8f8f8] p-2">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-gray-200 bg-white">
            {image ? (
              <Image
                unoptimized
                src={image}
                alt="Exam image"
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <div className="h-full w-full bg-gray-100" />
            )}
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="truncate text-sm text-gray-600 hover:text-[#155DFC]"
          >
            {image ? "Replace image" : "Select image"}
          </button>

          <div className="ml-auto flex items-center gap-2 text-gray-400">
            <Download className="h-3.5 w-3.5" />
            <button
              type="button"
              onClick={() => onChangeImage("")}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
