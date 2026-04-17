"use client";

import React from "react";
import ExamCard from "./exam-card";
import ExamCardSkeleton from "./exam-card-skeleton";
import { BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import useExamsList from "../_hooks/use-exams-list";
import { ExamsContentProps } from "../_types/exam";


export default function ExamsContent({
  diplomaId,
  diplomaTitle,
}: ExamsContentProps) {
  // Fetch exams using useExamsList hook
  const { data, error, isLoading, isError } = useExamsList(diplomaId);
  
  // Extract exams array from response payload with fallbacks
  const exams = data?.payload.data || [];

  // Loading state with skeleton cards
  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50 min-h-screen">
        {/* Breadcrumbs Skeleton */}
        <div className="w-full bg-white px-4 py-3 md:px-8 border-b border-gray-100 flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-2 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 w-2 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Top Banner Skeleton */}
        <div className="flex gap-1 w-full mt-6 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="bg-white border border-gray-200 p-4 shrink-0 h-16 w-16 rounded animate-pulse"></div>
          <div className="flex items-center gap-3 bg-gray-200 text-white px-6 py-4 flex-1 rounded animate-pulse">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-6 w-48 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Exams Skeleton Cards */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ExamCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with detailed error message
  if (isError || error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to load exams. Please try again.";

    return (
      <div className="p-12 text-center bg-white rounded-lg border border-red-100 text-red-600">
        <p className="font-bold"> Error loading exams</p>
        <p className="text-sm mt-2 text-gray-600">{errorMessage}</p>
        <p className="text-xs mt-4 text-gray-400">Diploma ID: {diplomaId}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      {/* Breadcrumbs Navigation */}
      <div className="w-full bg-white px-4 py-3 md:px-8 border-b border-gray-100 flex items-center text-sm font-mono tracking-tight">
        <span className="text-gray-400">
          <Link href="/" className="hover:underline">
            Diplomas
          </Link>
        </span>
        <span className="text-gray-300 mx-2">/</span>
        <span className="text-[#155DFC] ">{diplomaTitle}</span>
        <span className="text-gray-300 mx-2">/</span>
      </div>

      {/* Top Banner with Title */}
      <div className="flex gap-1 w-full mt-6 px-4 md:px-8 max-w-7xl mx-auto">
        <Link
          href="/"
          className="bg-white border border-gray-200 p-4 shrink-0 hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={24} className="text-[#155DFC]" />
        </Link>
        <div className="flex items-center gap-3 bg-[#155DFC] text-white px-6 py-4 flex-1 shadow-sm">
          <BookOpen size={24} strokeWidth={2} />
          <h1 className="font-semibold font-mono md:text-xl sm:text-sm">{diplomaTitle} Exams</h1>
        </div>
      </div>

      {/* Exams List Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-6">
        <div className="max-w-7xl mx-auto">
          {exams.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-12 text-center shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">No exams found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for available exams in this track.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} diplomaId={diplomaId} />
              ))}

              <div className="py-8 text-center text-gray-400 font-mono text-sm">
                End of list
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
