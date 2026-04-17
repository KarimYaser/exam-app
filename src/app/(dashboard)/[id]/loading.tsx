import ExamCardSkeleton from "./_components/exam-card-skeleton";

export default function Loading() {
  return (
    <div className="w-full flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-8 border-b pb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExamCardSkeleton />
          <ExamCardSkeleton />
          <ExamCardSkeleton />
          <ExamCardSkeleton />
          <ExamCardSkeleton />
          <ExamCardSkeleton />
        </div>
      </div>
    </div>
  );
}
