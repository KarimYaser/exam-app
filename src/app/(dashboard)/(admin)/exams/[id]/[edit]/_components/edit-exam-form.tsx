"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  updateExamById,
  type UpdateExamInput,
} from "../_actions/edit-exam.actions";
import {
  editExamSchema,
  type EditExamFormValues,
} from "../_schema/edit-exam.schema";
import { EditExamPageProps } from "../_types/edit-exam.types";
import ImageUploadField from "./image-upload-field";
import QuestionsPanel from "./questions-panel";

export default function EditExamForm({
  exam,
  diplomas,
  questions,
}: EditExamPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditExamFormValues>({
    resolver: zodResolver(editExamSchema),
    defaultValues: {
      title: exam.title || "",
      description: exam.description || "",
      image: exam.image || "",
      duration: exam.duration || 1,
      diplomaId: exam.diploma?.id || "",
    },
    mode: "onBlur",
  });

  const selectedImage = watch("image");

  const { mutate: updateExam, isPending } = useMutation({
    mutationFn: (values: UpdateExamInput) => updateExamById(exam.id, values),
    onSuccess: (response) => {
      toast.success(response?.message || "Exam updated successfully", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      router.push(`/exams/${exam.id}`);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update exam", {
        position: "top-right",
      });
    },
  });

  const onSubmit = (values: EditExamFormValues) => {
    updateExam(values);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px] overflow-y-auto">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-xs sm:px-6">
        <span className="text-gray-500">Exams</span>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500">{exam.title}</span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">Edit</span>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
              {exam.title}
            </h1>
            <p className="text-sm text-gray-500">
              Diploma: {exam.diploma?.title || "Unknown Diploma"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
              onClick={() => router.push(`/exams/${exam.id}`)}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              form="edit-exam-form"
              className="rounded-none border-0 bg-[#00BC7D] text-white hover:bg-[#01a66f]"
              disabled={isPending}
            >
              <Save className="h-4 w-4" />
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <form id="edit-exam-form" onSubmit={handleSubmit(onSubmit)} className="mb-4 rounded border border-gray-200 bg-white">
          <div className="bg-[#155DFC] px-3 py-2 text-sm font-semibold text-white">
            Exam Information
          </div>

          <div className="grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 sm:p-4">
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.title?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="diplomaId" className="mb-1.5 block text-sm font-medium text-gray-700">
                Diploma
              </label>
              <select
                id="diplomaId"
                {...register("diplomaId")}
                className="h-10 w-full rounded border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select diploma</option>
                {diplomas.map((diploma) => (
                  <option key={diploma.id} value={diploma.id}>
                    {diploma.title}
                  </option>
                ))}
              </select>
              {errors.diplomaId?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.diplomaId.message}</p>
              )}
            </div>

            <div>
              <input type="hidden" {...register("image")} />
              <ImageUploadField
                image={selectedImage}
                onChangeImage={(image) =>
                  setValue("image", image, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
              />
              {errors.image?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.image.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className="w-full rounded border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.description?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="duration" className="mb-1.5 block text-sm font-medium text-gray-700">
                Duration (min)
              </label>
              <input
                id="duration"
                type="number"
                min={1}
                {...register("duration", { valueAsNumber: true })}
                className="h-10 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.duration?.message && (
                <p className="mt-1 text-xs text-red-500">{errors.duration.message}</p>
              )}
            </div>
          </div>
        </form>

        <QuestionsPanel questions={questions} />
      </div>
    </div>
  );
}
