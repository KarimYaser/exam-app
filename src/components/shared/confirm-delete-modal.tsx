"use client";

import { AlertTriangle, X } from "lucide-react";

type ConfirmDeleteModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  deleteLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  open,
  title = "Are you sure you want to delete this item?",
  description = "This action cannot be undone.",
  deleteLabel = "Delete",
  cancelLabel = "Cancel",
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 font-mono">
      <div className="relative w-full max-w-[500px] border border-gray-200 bg-white shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="flex flex-col items-center px-8 pb-8 pt-12 text-center">
          {/* Icon with concentric circles */}
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-red-50/70">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-red-100/80">
              <AlertTriangle
                className="h-8 w-8 text-[#DE2828]"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <h3 className="mb-3 text-lg font-bold text-[#DE2828] sm:text-xl">
            {title}
          </h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 bg-[#FAFAFA] p-5 sm:p-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex w-full items-center justify-center bg-[#E5E7EB] py-3 text-[13px] font-bold text-gray-800 transition-colors hover:bg-[#D1D5DB] focus:outline-none disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex w-full items-center justify-center bg-[#DE2828] py-3 text-[13px] font-bold text-white transition-colors hover:bg-red-700 focus:outline-none disabled:opacity-60"
          >
            {isPending ? "Deleting..." : deleteLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
