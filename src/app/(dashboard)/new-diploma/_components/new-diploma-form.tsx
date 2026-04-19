"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  createDiploma,
  type CreateDiplomaInput,
} from "../../_actions/diplomas.actions";
import {
  newDiplomaSchema,
  type NewDiplomaFormValues,
} from "../_schema/new-diploma.schema";

export default function NewDiplomaForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewDiplomaFormValues>({
    resolver: zodResolver(newDiplomaSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
    mode: "onBlur",
  });

  const { mutate: create, isPending } = useMutation({
    mutationFn: (values: CreateDiplomaInput) => createDiploma(values),
    onSuccess: (response) => {
      toast.success(response?.message || "Diploma created successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-diplomas"] });
      router.push("/");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create diploma", {
        position: "top-right",
      });
    },
  });

  const setImageValue = (dataUrl: string) => {
    setPreviewImage(dataUrl);
    setValue("image", dataUrl, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleSelectFile = (file?: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file", { position: "top-right" });
      return;
    }
// Use FileReader to convert the image file to a data URL for preview and form submission
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setImageValue(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (values: NewDiplomaFormValues) => {
    create(values);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6 py-3 text-xs">
        <span className="text-gray-500">Diplomas</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">Add New Diploma</span>
      </div>

      <div className="flex shrink-0 justify-end border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => router.push("/")}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-diploma-form"
            className="rounded-none border-0 bg-[#00BC7D] text-white hover:bg-[#01a66f]"
            disabled={isPending}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <form
        id="new-diploma-form"
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 sm:p-6"
      >
        <div className="rounded border border-gray-200 bg-white">
          <div className="bg-[#155DFC] px-3 py-2 text-sm font-semibold text-white">
            Diploma Information
          </div>

          <div className="space-y-5 p-3 sm:p-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Image
              </label>

              <input type="hidden" {...register("image")} />

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleSelectFile(e.target.files?.[0])}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleSelectFile(e.dataTransfer.files?.[0]);
                }}
                className={`rounded border p-4 transition-colors ${
                  dragOver ? "border-[#155DFC] bg-blue-50" : "border-gray-200"
                }`}
              >
                {previewImage ? (
                  <div className="relative h-52 w-full overflow-hidden border border-gray-200 bg-gray-50 sm:h-56 sm:w-65">
                    <Image
                      unoptimized
                      src={previewImage}
                      alt="Diploma preview"
                      fill
                      className="object-cover"
                      sizes="260px"
                    />
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
                        onClick={() => fileInputRef.current?.click()}
                      >
                        select from your computer
                      </button>
                    </p>
                  </div>
                )}
              </div>
              {errors.image?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="h-11 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.title?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={6}
                {...register("description")}
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.description?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
