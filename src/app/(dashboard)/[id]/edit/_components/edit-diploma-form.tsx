"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";
import { deleteDiplomaById } from "@/app/(dashboard)/_actions/diplomas.actions";
import {
  updateDiplomaById,
  type UpdateDiplomaInput,
} from "../_actions/edit-diploma.actions";
import {
  editDiplomaSchema,
  type EditDiplomaFormValues,
} from "../_schema/edit-diploma.schema";
import type { EditDiplomaPageProps } from "../_types/edit-diploma.types";
import { ImageUploadField } from "./image-upload-field";

export default function EditDiplomaForm({ diploma }: EditDiplomaPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditDiplomaFormValues>({
    resolver: zodResolver(editDiplomaSchema),
    defaultValues: {
      title: diploma.title || "",
      description: diploma.description || "",
      image: diploma.image || "",
    },
    mode: "onBlur",
  });

  const selectedImage = watch("image") ?? "";
  const { mutate: updateDiploma, isPending } = useMutation({
    mutationFn: (values: UpdateDiplomaInput) =>
      updateDiplomaById(diploma.id, values),
    onSuccess: (response) => {
      toast.success(response?.message || "Diploma updated successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-diplomas"] });
      queryClient.invalidateQueries({ queryKey: ["diplomas"] });
      router.push(`/${diploma.id}?title=${encodeURIComponent(diploma.title)}`);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update diploma", {
        position: "top-right",
      });
    },
  });

  const { mutate: removeDiploma, isPending: isDeletingDiploma } = useMutation({
    mutationFn: () => deleteDiplomaById(diploma.id),
    onSuccess: (response) => {
      toast.success(response?.message || "Diploma deleted successfully", {
        position: "top-right",
      });
      setConfirmDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-diplomas"] });
      router.push("/");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete diploma", {
        position: "top-right",
      });
    },
  });

  const onSubmit = (values: EditDiplomaFormValues) => {
    updateDiploma(values);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f4f5f7] font-mono text-[13px]">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-xs sm:px-6">
        <span
          className="cursor-pointer text-gray-500 hover:underline"
          onClick={() => router.push("/")}
        >
          Diplomas
        </span>
        <span className="text-gray-300">/</span>
        <span
          className="cursor-pointer text-gray-500 hover:underline"
          onClick={() => router.push(`/${diploma.id}`)}
        >
          {diploma.title}
        </span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">Edit</span>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
              {diploma.title}
            </h1>
            <p className="text-sm text-gray-500">Update diploma information</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() =>
                router.push(
                  `/${diploma.id}?title=${encodeURIComponent(diploma.title)}`,
                )
              }
              disabled={isPending || isDeletingDiploma}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-none border-0 bg-[#EF4444] text-white hover:bg-red-600"
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={isPending || isDeletingDiploma}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              type="submit"
              form="edit-diploma-form"
              className="rounded-none border-0 bg-[#00BC7D] text-white hover:bg-[#01a66f]"
              disabled={isPending || isDeletingDiploma || isImageUploading}
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <form
          id="edit-diploma-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 rounded border border-gray-200 bg-white"
        >
          <div className="bg-[#155DFC] px-3 py-2 text-sm font-semibold text-white">
            Diploma Information
          </div>

          <div className="grid grid-cols-1 gap-4 p-3 sm:p-4">
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
                className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.title?.message ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div>
              <input type="hidden" {...register("image")} />
              <ImageUploadField
                value={selectedImage}
                error={errors.image?.message}
                onUploadingChange={setIsImageUploading}
                onChange={(image: string) =>
                  setValue("image", image, {
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
              {/* {errors.image?.message ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors.image.message}
                </p>
              ) : null} */}
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
                rows={5}
                {...register("description")}
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.description?.message ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors.description.message}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        title="Delete this diploma?"
        description="This action is permanent and cannot be undone."
        deleteLabel="Delete"
        isPending={isDeletingDiploma}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => removeDiploma()}
      />
    </div>
  );
}
