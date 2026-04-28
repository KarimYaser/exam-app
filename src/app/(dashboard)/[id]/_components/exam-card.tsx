import { Clock, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ExamCardProps } from "../_types/exam";

export default function ExamCard({ exam, diplomaId }: ExamCardProps) {
  return (
    <div className="flex flex-col md:flex-row bg-[#EFF6FF] border border-gray-100 shadow-[0_2px_4px_rgba(0,0,0,0.02)] p-4 md:p-6 gap-6 relative group transition-all duration-300 hover:shadow-md">
      {/* Left Icon Square */}
      <div className="w-full aspect-video md:w-24 md:h-24 md:aspect-auto border border-blue-300 shrink-0 overflow-hidden bg-gray-50 shadow-sm flex items-center justify-center relative">
        {exam.image ? (
          <Image
            unoptimized
            src={exam.image || ""}
            alt={exam.title}
            fill
            className="object-cover p-2 "
          />
        ) : (
          <div className="w-full aspect-video md:w-24 md:h-24 md:aspect-auto border border-blue-300 shrink-0 overflow-hidden bg-gray-50 shadow-sm flex items-center justify-center relative">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center font-mono">
        <div className="flex flex-wrap justify-between items-center md:flex-row md:items-start md:justify-between mb-2 gap-2">
          {/* Title */}
          <h3 className="font-bold text-lg md:text-xl text-blue-600">
            {exam.title}
          </h3>

          {/* Top Right Stats (Questions & Minutes) */}
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-800 shrink-0">
            <div className="flex items-center gap-1.5">
              <HelpCircle size={14} className="text-gray-800" />
              <span>{exam.questionsCount} Questions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-800" />
              <span>{exam.duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Description line clamped exactly 3 lines with 'See More' */}
        <div className="relative">
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-4xl line-clamp-3">
            {exam.description}
          </p>
        </div>
      </div>

      {/* Hover reveal button over standard flow */}
      <div className="md:absolute md:bottom-6 md:right-6 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform md:translate-y-2 group-hover:translate-y-0">
        <Link
          href={`/${diplomaId}/${exam.id}?diplomaName=${encodeURIComponent(exam.diploma?.title || "Diploma")}&examName=${encodeURIComponent(exam.title)}`}
          className="inline-flex w-full md:w-auto items-center justify-center px-6 py-2 bg-[#0050ff] text-white font-semibold text-sm font-mono shadow hover:bg-blue-700 transition"
        >
          START →
        </Link>
      </div>
    </div>
  );
}
