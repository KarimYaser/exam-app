"use client";

import { useRouter } from "next/navigation";
import DiplomaCard from "./diploma-card";
import { Diploma } from "../_actions/diplomas.actions";
import useDiplomaList from "../_hooks/use-diploma-list";
import DiplomaCardSkeleton from "./diploma-card-skeleton";
import { AlertCircle, ChevronDown } from "lucide-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMemo } from "react";

export function DiplomasGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <DiplomaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function DiplomasList() {
  const router = useRouter();
  const {
    data: diplomasPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useDiplomaList();

  if (isLoading) {
    return <DiplomasGridSkeleton />;
    // return <h4>Loading...</h4>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
        <AlertCircle size={32} />
        <p className="text-sm">Failed to load diplomas. Please try again.</p>
      </div>
    );
  }
  const diplomas = useMemo(
    () =>
      diplomasPages?.pages?.flatMap(
        (page: any) => page?.payload?.data || page?.data || [],
      ) || [],
    [diplomasPages],
  );

  return (
    <InfiniteScroll
      dataLength={diplomas.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      scrollableTarget="scrollable-content"
      endMessage={
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
          <p className="text-sm">End of list</p>
        </div>
      }
      loader={
        <div className="mt-4">
          <DiplomasGridSkeleton />
        </div>
        // <h4>Loading...</h4>
      }
      // style={{ overflow: "visible" }} // Ensures no hidden overflow issues
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
        {diplomas.map((diploma: Diploma, index: number) => (
          <DiplomaCard
            onClick={() =>
              router.push(
                `/${diploma.id}?title=${encodeURIComponent(diploma.title)}`,
              )
            }
            key={diploma.id || index}
            title={diploma.title || "Untitled Diploma"}
            description={diploma.description || ""}
            image={diploma.image}
          />
        ))}
        {hasNextPage && (
          <div className="col-span-full flex flex-col items-center mt-6 text-gray-400">
            <p className="text-xs font-mono">Scroll to view more</p>
            <ChevronDown size={16} className="mt-1" />
          </div>
        )}
      </div>
    </InfiniteScroll>
  );
}
