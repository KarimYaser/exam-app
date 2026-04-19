"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminExamCardItem } from "../_types/admin-exam";

type AdminExamCardProps = {
  exam: AdminExamCardItem;
};

export default function AdminExamCard({ exam }: AdminExamCardProps) {
  const router = useRouter();

  const goToDetails = () => {
    router.push(`/exams/${exam.id}`);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToDetails();
        }
      }}
      className="grid cursor-pointer grid-cols-[56px_1fr_1fr_120px_40px] items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm transition-colors hover:bg-gray-50 sm:gap-4 sm:px-4"
    >
      <div className="relative h-12 w-12 overflow-hidden border border-gray-200 bg-gray-100">
        {exam.image ? (
          <Image
            unoptimized
            src={exam.image}
            alt={exam.title}
            fill
            className="object-cover"
            sizes="48px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 text-sm font-bold text-white">
            {exam.title
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        )}
      </div>

      <p className="truncate font-medium text-gray-800" title={exam.title}>
        {exam.title}
      </p>

      <p className="truncate text-gray-600" title={exam.diplomaTitle}>
        {exam.diplomaTitle}
      </p>

      <p className="text-gray-700">{exam.questionsCount}</p>

      <div
        className="flex justify-end"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded p-1 text-gray-500 outline-none hover:bg-gray-100 hover:text-gray-800">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-sans">
            <DropdownMenuItem className="cursor-pointer" onClick={goToDetails}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
