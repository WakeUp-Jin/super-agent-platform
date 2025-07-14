import { Skeleton } from '@/components/ui/skeleton';

export const SkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="rounded-lg border border-gray-200 bg-white p-4">
          {/* 头部骨架 */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>

          {/* 内容骨架 */}
          <div className="flex flex-col gap-3">
            {[...Array(2)].map((_, itemIndex) => (
              <div key={itemIndex} className="rounded-md border border-gray-100 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
