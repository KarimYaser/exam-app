"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { AdminExam } from "../../_types/admin-exam";

interface AdminExamInfoProps {
  exam: AdminExam;
  questionsCount: number;
}

export default function AdminExamInfo({
  exam,
  questionsCount,
}: AdminExamInfoProps) {
  return (
    <div className="mb-4 rounded border border-gray-200 bg-white p-4 sm:p-4 max-h-[646px] overflow-y-scroll">
      <div className="mb-1 text-[14px] font-medium text-gray-400">Image</div>
      <div className="relative mb-4 h-[300px]  lg:max-w-[300px] sm:w-full overflow-hidden border border-gray-200 bg-gray-50 sm:h-60 sm:w-55">
        {exam.image ? (
          <Image
            unoptimized
            src={exam.image}
            alt={exam.title}
            fill
            className="object-cover"
            sizes="300px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-slate-700 to-slate-900 text-4xl font-bold text-white">
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

      <div className="mb-1 text-[14px] font-medium text-gray-400">Title</div>
      <p className="mb-4 text-base text-black">{exam.title}</p>

      <div className="mb-1 text-[14px] font-medium text-gray-400">
        Description
      </div>
      <p className="mb-4 max-w-250 leading-7 text-black">{exam.description}</p>

      <div className="mb-1 text-[14px] font-medium text-gray-400">Diploma</div>
      <p className="mb-4 inline-flex items-center gap-1.5 text-black">
        {exam.diploma?.title || "Unknown Diploma"}
        <ExternalLink className="h-3.5 w-3.5" />
      </p>

      <div className="mb-1 text-[14px] font-medium text-gray-400">Duration</div>
      <p className="mb-4 text-black">{exam.duration} Minutes</p>

      <div className="mb-1 text-[14px] font-medium text-gray-400">
        No. of Questions
      </div>
      <p className="text-black">{questionsCount}</p>
    </div>
  );
}
