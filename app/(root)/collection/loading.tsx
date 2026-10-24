import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col">
      {/* Sticky header skeleton */}
      <div className="sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 px-4 py-3 backdrop-blur-md">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="mt-1 h-3.5 w-48 rounded-md" />
        <div className="mt-3">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>

      {/* Feed post skeletons */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex gap-3 p-4 sm:p-5">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="h-5 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
              <div className="flex gap-1.5 pt-1">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;
