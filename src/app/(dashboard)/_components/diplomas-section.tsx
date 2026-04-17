"use client";

import { ChevronDown, GraduationCap } from "lucide-react";
import DiplomasList from "./diplomas-list";

export default function DiplomasSection() {
  return (
    <div className="flex flex-col h-screen">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white">
        <p className="text-xs text-blue-600 font-mono">Diplomas</p>
      </div>

      {/* Content */}
      <div
        id="scrollable-content"
        className="flex-1 overflow-y-auto p-6 bg-gray-50"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 bg-blue-600 text-white px-5 py-3 mb-6">
          <GraduationCap size={45} />
          <h1 className="text-lg font-bold">Diplomas</h1>
        </div>

        {/* Cards Grid Component handles loading/error/data dynamically */}
        <DiplomasList />
      </div>
    </div>
  );
}
