import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col">
      {/* Header with back arrow */}
      <div className="sticky top-0 z-30 flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 px-4 py-2 backdrop-blur-md">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      </div>

      {/* Banner Skeleton */}
      <Skeleton className="h-36 sm:h-48 w-full" />

      {/* Profile info section */}
      <div className="relative px-4 pb-4">
        {/* Avatar overlapping banner */}
        <div className="-mt-16 sm:-mt-20 mb-3 flex items-end justify-between">
          <Skeleton className="size-28 sm:size-36 rounded-full border-4 border-white dark:border-black" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        {/* User meta skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-44 rounded-md" />
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          
          <div className="mt-2 flex gap-4">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
        </div>

        {/* Stat cards skeleton */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>

      {/* Feed post skeletons */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-neutral-200 dark:border-neutral-800">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex gap-3 p-4 sm:p-5">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex flex-1 flex-col gap-2.5">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-5 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
