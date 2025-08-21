'use client';

import React, { useEffect, useState } from 'react';

interface HydrationErrorBoundaryProps {
  children: React.ReactNode;
}

export default function HydrationErrorBoundary({ children }: HydrationErrorBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Mark as hydrated after component mounts
    setIsHydrated(true);
  }, []);

  // Show loading state until hydrated
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
