"use client";

import { useRouter } from "next/navigation";
import { CircleOff, Pencil, Trash2 } from "lucide-react";
import { AdminExam } from "../../_types/admin-exam";

interface AdminExamHeaderProps {
  exam: AdminExam;
  onDeleteClick: () => void;
}

export default function AdminExamHeader({
  exam,
  onDeleteClick,
}: AdminExamHeaderProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 text-xs sm:px-6">
        <span
          className="text-gray-500 hover:underline cursor-pointer"
          onClick={() => router.push("/exams")}
        >
          Exams
        </span>
        <span className="text-gray-300">/</span>
        <span className="font-semibold text-[#155DFC]">{exam.title}</span>
      </div>

      <div className="mb-4 flex flex-col gap-3 border-b border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[18px] font-semibold tracking-tight text-gray-800">
            {exam.title}
          </h1>
          <p className="text-[14px] text-gray-500">
            Diploma: {exam.diploma?.title || "Unknown Diploma"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded ${exam.immutable ? "bg-gray-100 text-gray-500" : "bg-yellow-500 text-white"} px-3 py-1.5 text-xs`}
          >
            {exam.immutable ? (
              <CircleOff className="h-3.5 w-3.5 text-gray-500" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}
            {exam.immutable ? "Immutable" : "Mutable"}
          </span>
          <button
            type="button"
            onClick={() => router.push(`/exams/${exam.id}/edit`)}
            className="inline-flex items-center gap-1 bg-[#155DFC] px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={onDeleteClick}
            className="inline-flex items-center gap-1 bg-[#EF4444] px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
