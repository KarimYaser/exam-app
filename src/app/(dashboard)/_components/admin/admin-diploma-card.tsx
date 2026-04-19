"use client";

import Image from "next/image";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AdminDiplomaMock } from "./admin-diplomas.mock";
import { useRouter } from "next/navigation";

type AdminDiplomaCardProps = {
  diploma: AdminDiplomaMock;
  className?: string;
};

export default function AdminDiplomaCard({
  diploma,
  className,
}: AdminDiplomaCardProps) {
  const router = useRouter();

  const handleOpenDetails = () => {
    router.push(`/${diploma.id}?title=${encodeURIComponent(diploma.title)}`);
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
      className={cn(
        "flex flex-col cursor-pointer gap-3 border-b border-gray-200 bg-gray-100 px-4 py-4 text-sm last:border-b-0 font-mono sm:grid sm:grid-cols-[56px_1fr_1.2fr_40px] sm:items-center sm:gap-4",
        className,
      )}
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
          className="font-semibold text-gray-900 truncate"
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
          <DropdownMenuTrigger className="rounded p-1 text-gray-500 outline-none hover:bg-gray-100 hover:text-gray-800">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 font-sans">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={handleOpenDetails}
            >
              <Eye className="h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Pencil className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
