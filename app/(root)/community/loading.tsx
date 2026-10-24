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

      {/* User rows */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item} className="flex items-start justify-between gap-3 p-4">
            <div className="flex gap-3 flex-1 min-w-0">
              <Skeleton className="size-11 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3.5 w-24 rounded-md" />
                <Skeleton className="h-3.5 w-4/5 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;