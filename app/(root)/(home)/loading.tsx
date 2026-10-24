import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
      {/* Header Tabs Skeleton */}
      <div className="sticky top-0 z-30 flex border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 px-4 py-3 backdrop-blur-md">
        <div className="flex w-full items-center justify-around">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>

      {/* Quick compose skeleton */}
      <div className="flex items-start gap-3 p-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <div className="flex justify-end pt-2">
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        </div>
      </div>

      {/* Feed post skeletons */}
      {[1, 2, 3, 4, 5, 6].map((item) => (
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
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-2 max-w-[420px]">
              <Skeleton className="h-4 w-8 rounded-md" />
              <Skeleton className="h-4 w-8 rounded-md" />
              <Skeleton className="h-4 w-8 rounded-md" />
              <Skeleton className="h-4 w-8 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;