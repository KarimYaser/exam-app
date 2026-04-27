"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Eye,
  MoreHorizontal,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Diploma } from "@/lib/types/diplomas";
import { deleteDiplomaById } from "@/app/(dashboard)/_actions/diplomas.actions";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";

type AdminDiplomaCardProps = {
  diploma: Diploma;
  className?: string;
};

export default function AdminDiplomaCard({
  diploma,
  className,
}: AdminDiplomaCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { mutate: removeDiploma, isPending: isDeletingDiploma } = useMutation({
    mutationFn: () => deleteDiplomaById(diploma.id),
    onSuccess: (response) => {
      toast.success(response?.message || "Diploma deleted successfully", {
        position: "top-right",
      });
      setConfirmDeleteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-diplomas"] });
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete diploma", {
        position: "top-right",
      });
    },
  });

  const handleOpenDetails = () => {
    router.push(`/${diploma.id}`);
  };

  const handleOpenEdit = () => {
    router.push(`/${diploma.id}/edit`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpenDetails();
        }
      }}
      className="flex flex-col cursor-pointer gap-3 border-b border-gray-200 bg-white px-4 py-4 text-sm last:border-b-0 font-mono sm:grid sm:grid-cols-[56px_1fr_1.2fr_40px] sm:items-center sm:gap-4"
    >
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded border border-slate-200 sm:h-14 sm:w-14">
        <Image
          unoptimized
          src={diploma.image as string}
          alt={diploma.title}
          fill
          sizes="(max-width: 640px) 100vw, 56px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <p
          className="font-semibold text-gray-900 truncate hover:underline"
          title={diploma.title}
        >
          {diploma.title}
        </p>
      </div>

      <div className="min-w-0 text-gray-500 line-clamp-3 leading-relaxed">
        {diploma.description}
      </div>

      <div
        className="flex justify-end sm:self-center"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="text-gray-500 bg-gray-200 p-1.5 hover:text-gray-800 cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-40 font-sans bg-white *:hover:bg-gray-100"
          >
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={handleOpenDetails}
            >
              <Eye className="h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={handleOpenEdit}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <ConfirmDeleteModal
          open={confirmDeleteOpen}
          title="Delete this diploma?"
          description="This will permanently delete the diploma and all associated data."
          deleteLabel="Delete"
          isPending={isDeletingDiploma}
          onCancel={() => setConfirmDeleteOpen(false)}
          onConfirm={() => removeDiploma()}
        />
      </div>
    </div>
  );
}
