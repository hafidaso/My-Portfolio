"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize scroll handler to prevent unnecessary re-renders
  const toggleVisibility = useCallback(() => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Use passive listener for better performance
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [mounted, toggleVisibility]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted || !isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className="rainbow-back-top focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-200 hover:scale-105 active:scale-95"
      style={{ opacity: 1 }}
      aria-label="Back to top"
      title="Back to top"
      suppressHydrationWarning
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
