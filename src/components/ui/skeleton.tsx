import React from 'react';
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  return React.createElement('div', {
    className: cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className),
    ...props
  });
}

export { Skeleton }; 