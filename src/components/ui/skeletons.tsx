import { Skeleton } from './skeleton';

export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex items-center text-sm mt-auto space-x-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function GitHubStatsSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="max-w-3xl mx-auto lg:mx-0 w-full">
      <Skeleton className="h-12 w-full mb-6" />
      <div className="flex flex-wrap items-center text-sm mb-8 space-x-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg mb-8" />
      <div>
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-3" />
        <Skeleton className="h-4 w-2/3 mb-3" />
      </div>
    </div>
  );
}

export function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: 6 }, (_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
} 