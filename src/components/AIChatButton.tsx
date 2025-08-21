"use client";

import { Bot } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import AIChatBox from "./AIChatBox";

export default function AIChatButton() {
  const [chatBoxOpen, setChatBoxOpen] = useState(false);

  // Cleanup function to ensure proper state management
  const handleClose = useCallback(() => {
    setChatBoxOpen(false);
    // Force a small delay to ensure state is properly updated
    setTimeout(() => {
      // Clear any potential event listeners or state conflicts
      document.body.style.overflow = '';
    }, 100);
  }, []);

  // Handle opening chat
  const handleOpen = useCallback(() => {
    setChatBoxOpen(true);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chatBoxOpen) {
        setChatBoxOpen(false);
        document.body.style.overflow = '';
      }
    };
  }, [chatBoxOpen]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (chatBoxOpen) {
      // Only prevent scroll on mobile devices
      if (window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [chatBoxOpen]);

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 min-h-[56px] min-w-[56px] touch-manipulation"
        aria-label="Open AI Chat"
        type="button"
        style={{ touchAction: 'manipulation' }}
      >
        <Bot size={24} className="animate-pulse" />
      </button>
      <AIChatBox open={chatBoxOpen} onClose={handleClose} />
    </>
  );
}
