"use client";

import { AlertTriangle } from "lucide-react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-md rounded border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>

        <div className="px-4 py-4 text-sm text-gray-600">{description}</div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isPending ? "Deleting..." : deleteLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
