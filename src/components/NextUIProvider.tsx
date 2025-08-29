"use client";

import { NextUIProvider as UIProvider } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

export function NextUIProvider({ children }: { children: ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-background" />;
  }
  
  return (
    <UIProvider>
      {children}
    </UIProvider>
  );
}
