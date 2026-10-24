import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col">
      {/* Sticky header skeleton */}
      <div className="sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 px-4 py-3 backdrop-blur-md">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="mt-1 h-3.5 w-48 rounded-md" />
        <div className="mt-3">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>

      {/* Trending Tag rows */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="flex flex-col gap-1.5 p-4">
            <Skeleton className="h-3 w-28 rounded-md" />
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
