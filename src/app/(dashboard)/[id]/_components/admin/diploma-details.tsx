"use client";

import { useState } from "react";
import Image from "next/image";
import { Ban, Pencil, Trash2 } from "lucide-react";
import { Diploma } from "@/lib/types/diplomas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteDiplomaById } from "@/app/(dashboard)/_actions/diplomas.actions";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

export default function DiplomaDetails({ diploma }: { diploma: Diploma }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: deleteDiploma, isPending: isDeletingDiploma } = useMutation({
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

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f4f5f7] font-mono text-[13px]">
      {/* bredcumbs */}
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-6 py-3 text-xs">
        <span className="text-gray-500 hover:underline cursor-pointer">
          <Link href="/">Diplomas</Link>
        </span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">{diploma.title}</span>
      </div>
      {/* header */}
      <div className="bg-white mb-4 flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
          {diploma.title}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded px-3 py-1.5 text-xs ${diploma?.immutable ? "bg-gray-100 text-gray-700" : "bg-yellow-100 text-yellow-700"}`}
          >
            {diploma?.immutable ? (
              <Ban className="h-3.5 w-3.5" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
            {diploma?.immutable ? "Immutable" : "Mutable"}
          </span>
          <button
            type="button"
            onClick={() => router.push(`/${diploma.id}/edit`)}
            className="inline-flex items-center gap-1 bg-[#155DFC] px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteOpen(true)}
            className="inline-flex items-center gap-1 bg-[#EF4444] px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 ">
        <div className="rounded border border-gray-200 bg-white p-3 sm:p-4">
          <div className="mb-1 text-xs font-medium text-gray-400">Image</div>
          <div className="relative mb-4 h-56 w-full max-w-[220px] overflow-hidden border border-gray-200 bg-gray-50 sm:h-60 sm:w-[220px]">
            {diploma.image ? (
              <Image
                unoptimized
                src={diploma.image}
                alt={diploma.title}
                fill
                className="object-cover"
                sizes="220px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 text-4xl font-bold text-white">
                {diploma.title}
              </div>
            )}
          </div>

          <div className="mb-1 text-xs font-medium text-gray-400">Title</div>
          <p className="mb-4 text-base font-semibold text-gray-800">
            {diploma.title}
          </p>

          <div className="mb-1 text-xs font-medium text-gray-400">
            Description
          </div>
          <p className="max-w-[1000px] leading-7 text-gray-800">
            {diploma.description ||
              `No description available for diploma ${diploma.id}.`}
          </p>
        </div>
      </div>

      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        title="Delete this diploma?"
        description="This action is permanent and cannot be undone."
        deleteLabel="Delete"
        isPending={isDeletingDiploma}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={() => deleteDiploma()}
      />
    </div>
  );
}
