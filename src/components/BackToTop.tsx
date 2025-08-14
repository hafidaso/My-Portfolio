"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [mounted]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted || !isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="rainbow-back-top"
      style={{ opacity: 1 }}
      aria-label="Back to top"
      title="Back to top"
      suppressHydrationWarning
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
