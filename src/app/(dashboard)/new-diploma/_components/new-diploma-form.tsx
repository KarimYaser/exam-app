"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  newDiplomaSchema,
  type NewDiplomaFormValues,
} from "../_schema/new-diploma.schema";
import { ImageUploadField } from "./image-upload-field";
import {
  createDiploma,
  type CreateDiplomaInput,
} from "../_actions/create-diploma.actions";

export default function NewDiplomaForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isImageUploading, setIsImageUploading] = useState(false);

  const {
    control,
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
  // if you're editing an existing diploma that already has an image, it will be set here
  // for a new diploma, it will be set after uploading an image
  const imageValue = useWatch({ control, name: "image" }) ?? "";

  const onSubmit = (values: NewDiplomaFormValues) => {
    create(values);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6 py-3 text-xs">
        <span
          className="text-gray-500 cursor-pointer hover:underline"
          onClick={() => router.push("/")}
        >
          Diplomas
        </span>
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
            disabled={isPending || isImageUploading}
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
              <ImageUploadField
                value={imageValue}
                error={errors.image?.message}
                onUploadingChange={setIsImageUploading}
                onChange={(value) =>
                  setValue("image", value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                onRemove={() =>
                  setValue("image", "", {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="h-11 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.title?.message && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title.message}
                </p>
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
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
