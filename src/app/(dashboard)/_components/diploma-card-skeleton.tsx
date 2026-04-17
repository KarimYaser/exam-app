export default function DiplomaCardSkeleton() {
  return (
    <div className="relative overflow-hidden min-h-[200px] bg-gray-200 animate-pulse">
      {/* Image placeholder area */}
      <div className="w-full h-full absolute inset-0 bg-gray-200" />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}
