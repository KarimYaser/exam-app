"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { Diploma } from "@/lib/types/diplomas";
import { Button } from "@/components/ui/button";
import {
  createExamSchema,
  type CreateExamFormValues,
} from "../_schema/create-exam.schema";
import { useCreateExam } from "../_hooks/use-create-exam";
import { ImageUploadField } from "./image-upload-field";
import { QuestionsPanel } from "./questions-panel";
import type { CreateExamPageProps } from "../_types/create-exam.types";
import Link from "next/link";

function resolveDiplomaId(input: string, diplomas: Diploma[]): string | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  const selectedOptionMatch = input.match(/\(([^)]+)\)\s*$/);
  if (selectedOptionMatch?.[1]) {
    const extractedId = selectedOptionMatch[1].trim();
    const matchedFromOption = diplomas.find(
      (diploma) => diploma.id === extractedId,
    );
    if (matchedFromOption) return matchedFromOption.id;
  }

  const byId = diplomas.find(
    (diploma) => diploma.id.toLowerCase() === normalized,
  );
  if (byId) return byId.id;

  const byTitle = diplomas.find(
    (diploma) => diploma.title.trim().toLowerCase() === normalized,
  );
  if (byTitle) return byTitle.id;

  const partialMatches = diplomas.filter((diploma) => {
    const title = diploma.title.trim().toLowerCase();
    const id = diploma.id.toLowerCase();
    return title.includes(normalized) || id.includes(normalized);
  });

  if (partialMatches.length === 1) {
    return partialMatches[0].id;
  }

  return null;
}

export function CreateExamForm({
  diplomas,
  questions = [],
}: CreateExamPageProps) {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateExam();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const { data: diplomasQueryData } = useQuery({
    queryKey: ["create-exam-diplomas"],
    queryFn: async () => {
      const response = await fetch(`/api/diplomas?page=1&limit=200`);
      if (!response.ok) {
        throw new Error("Failed to fetch diplomas");
      }
      return response.json();
    },
    retry: 1,
  });

  const availableDiplomas = useMemo(() => {
    const fromApi = (diplomasQueryData?.payload?.data ??
      diplomasQueryData?.data ??
      []) as Diploma[];
    return fromApi.length > 0 ? fromApi : diplomas;
  }, [diplomasQueryData, diplomas]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateExamFormValues>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      diplomaInput: "",
    },
    mode: "onChange",
  });

  const imageValue = useWatch({ control, name: "image" }) ?? "";
  const diplomaInputValue = useWatch({ control, name: "diplomaInput" }) ?? "";

  const filteredDiplomas = useMemo(() => {
    const keyword = diplomaInputValue?.trim().toLowerCase() || "";
    if (!keyword) return availableDiplomas.slice(0, 8);

    return availableDiplomas
      .filter((diploma) => {
        const title = diploma.title.trim().toLowerCase();
        const id = diploma.id.toLowerCase();
        return title.includes(keyword) || id.includes(keyword);
      })
      .slice(0, 8);
  }, [diplomaInputValue, availableDiplomas]);

  const onSubmit = (values: CreateExamFormValues) => {
    const diplomaId = resolveDiplomaId(values.diplomaInput, availableDiplomas);

    if (!diplomaId) {
      toast.error("Please enter a valid diploma name or id", {
        position: "top-right",
      });
      return;
    }

    create(
      {
        title: values.title,
        description: values.description,
        image: values.image,
        duration: values.duration,
        diplomaId,
      },
      {
        onSuccess: (response) => {
          toast.success(response?.message || "Exam created successfully", {
            position: "top-right",
          });
          router.push("/exams");
          router.refresh();
        },
        onError: (error: Error) => {
          toast.error(error?.message || "Failed to create exam", {
            position: "top-right",
          });
        },
      },
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f4f5f7] font-mono text-[13px] overflow-auto">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6 py-3 text-xs">
        <span className="text-gray-500">
          <Link href="/exams" className="hover:underline">
            Exams
          </Link>
        </span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">Add New Exam</span>
      </div>

      <div className="flex shrink-0 justify-end border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={() => router.push("/exams")}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="submit"
            form="new-exam-form"
            className="rounded-none border-0 bg-[#00BC7D] text-white hover:bg-[#01a66f] disabled:opacity-50"
            disabled={isPending || isImageUploading || !isValid}
          >
            <Save className="h-4 w-4" />
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <form
        id="new-exam-form"
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 sm:p-6"
      >
        <div className="rounded border border-gray-200 bg-white">
          <div className="bg-[#155DFC] px-3 py-2 text-sm font-semibold text-white">
            Exam Information
          </div>

          <div className="grid gap-4 p-3 sm:grid-cols-2 sm:p-4">
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
              {errors.title?.message ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors.title.message}
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="diplomaInput"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Diploma Name or ID
              </label>
              <div className="relative">
                <input
                  id="diplomaInput"
                  type="text"
                  placeholder="Type diploma title or id"
                  {...register("diplomaInput", {
                    onChange: () => setShowSuggestions(true),
                  })}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 120);
                  }}
                  className="h-11 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
                />

                {showSuggestions ? (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded border border-gray-200 bg-white shadow">
                    {filteredDiplomas.length > 0 ? (
                      filteredDiplomas.map((diploma) => (
                        <button
                          key={diploma.id}
                          type="button"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setValue("diplomaInput", diploma.title, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                            setShowSuggestions(false);
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100"
                        >
                          <span className="truncate text-gray-800">
                            {diploma.title}
                          </span>
                          <span className="ml-3 shrink-0 text-xs text-gray-500">
                            {diploma.id}
                          </span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-2 text-xs text-gray-500">
                        No matching diploma found
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              {errors.diplomaInput?.message ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors.diplomaInput.message}
                </p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
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
                htmlFor="duration"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Duration (min)
              </label>
              <input
                id="duration"
                type="number"
                min={1}
                {...register("duration", { valueAsNumber: true })}
                className="h-11 w-full rounded border border-gray-200 px-3 text-sm outline-none focus:border-[#155DFC] focus:ring-2 focus:ring-blue-100"
              />
              {errors.duration?.message ? (
                <p className="mt-1 text-xs text-red-500">
                  {errors.duration.message}
                </p>
              ) : null}
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
                rows={4}
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
        </div>

        <QuestionsPanel questions={questions} />
      </form>
    </div>
  );
}
