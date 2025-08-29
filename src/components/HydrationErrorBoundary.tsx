"use client";

import { ReactNode, useEffect, useState } from "react";

interface HydrationErrorBoundaryProps {
  children: ReactNode;
}

export default function HydrationErrorBoundary({ children }: HydrationErrorBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Mark as hydrated after component mounts
    setIsHydrated(true);
  }, []);

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Show error state if hydration failed
  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
