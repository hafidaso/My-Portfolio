import { Message } from "ai/react";
import { Bot, User, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EnhancedChatMessageProps {
  message: Message;
  isLatest?: boolean;
}

// Professional avatar component
const Avatar = ({ isBot, isTyping = false }: { isBot: boolean; isTyping?: boolean }) => {
  if (isBot) {
    return (
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
        "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg",
        isTyping && "animate-pulse scale-110"
      )}>
        <Bot size={16} className="drop-shadow-sm" />
      </div>
    );
  }
  
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-500 to-gray-700 text-white shadow-lg">
      <User size={16} className="drop-shadow-sm" />
    </div>
  );
};

// Typing animation component
const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 py-2">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>
      <span className="text-xs text-gray-500 ml-2">Hafida is thinking...</span>
    </div>
  );
};

// Enhanced link component with better debugging and functionality
const EnhancedLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    // Don't prevent default - let the link work naturally
    console.log('🔗 EnhancedLink clicked:', href);
    
    // For external links, let the browser handle them naturally
    if (href.startsWith('http') || href.startsWith('mailto:')) {
      // Let the browser handle external links naturally
      return;
    }
    
    // For internal links, let Next.js handle them
    if (href.startsWith('/')) {
      // Let the browser handle internal links naturally
      return;
    }
  };

  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300",
        "underline font-medium transition-all duration-200 cursor-pointer",
        "hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 py-0.5 rounded",
        "touch-manipulation",
        isHovered && "scale-105"
      )}
      style={{ 
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(59, 130, 246, 0.3)',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {children}
      <ExternalLink size={12} className="opacity-70" />
    </a>
  );
};

// Animated text component for smooth appearance
const AnimatedText = ({ content, isLatest }: { content: string; isLatest: boolean }) => {
  const [displayedContent, setDisplayedContent] = useState(isLatest ? '' : content);
  const [useAnimation, setUseAnimation] = useState(false);
  
  useEffect(() => {
    // Check if device can handle animations smoothly
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth <= 768;
    
    // Disable animation on mobile or if user prefers reduced motion
    if (prefersReducedMotion || isMobile) {
      setDisplayedContent(content);
      return;
    }
    
    if (isLatest && content && content.length < 200) { // Only animate short messages
      setUseAnimation(true);
      let index = 0;
      const interval = setInterval(() => {
        setDisplayedContent(content.slice(0, index));
        index++;
        if (index > content.length) {
          clearInterval(interval);
        }
      }, 15); // Faster typing speed
      
      return () => clearInterval(interval);
    } else {
      setDisplayedContent(content);
      setUseAnimation(false);
    }
  }, [content, isLatest]);
  
  return (
    <ReactMarkdown 
      className="prose prose-sm dark:prose-invert max-w-none"
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 last:mb-0 pl-4">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 last:mb-0 pl-4">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-purple-700 dark:text-purple-300">{children}</strong>,
        em: ({ children }) => <em className="text-blue-600 dark:text-blue-400">{children}</em>,
        code: ({ children }) => (
          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        ),
        a: ({ href, children }) => {
          console.log('🔗 ReactMarkdown rendering link:', { href, children });
          if (!href) {
            console.warn('🔗 No href provided for link:', children);
            return <span className="text-red-500">{children}</span>;
          }
          
          return (
            <EnhancedLink href={href}>
              {children}
            </EnhancedLink>
          );
        }
      }}
    >
      {displayedContent}
    </ReactMarkdown>
  );
};

export default function EnhancedChatMessage({ message, isLatest = false }: EnhancedChatMessageProps) {
  const isBot = message.role === "assistant";
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className={cn(
      "flex gap-3 mb-4 transition-all duration-500 ease-out",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      isBot ? "justify-start" : "justify-end"
    )}>
      {/* Bot Avatar - Left side */}
      {isBot && (
        <div className="flex-shrink-0">
          <Avatar isBot={true} />
        </div>
      )}
      
      {/* Message Content */}
      <div className={cn(
        "max-w-[80%] group",
        isBot ? "order-2" : "order-1"
      )}>
        {/* Message Bubble */}
        <div className={cn(
          "relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200",
          "hover:shadow-md transform hover:scale-[1.01]",
          isBot 
            ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-sm" 
            : "bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-tr-sm"
        )}>
          {/* Message bubble tail */}
          <div className={cn(
            "absolute top-0 w-0 h-0 border-l-8 border-r-8 border-t-8",
            isBot 
              ? "left-0 -translate-x-2 border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700"
              : "right-0 translate-x-2 border-l-transparent border-r-transparent border-t-purple-500"
          )} />
          
          {/* Sender name for bot */}
          {isBot && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                Hafida Belayd
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          )}
          
          {/* Message Content */}
          <div className={cn(
            "text-sm leading-relaxed",
            isBot ? "text-gray-800 dark:text-gray-200" : "text-white"
          )}>
            <AnimatedText content={message.content} isLatest={isLatest} />
          </div>
          
          {/* Timestamp */}
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isBot ? "text-gray-500" : "text-purple-100"
          )}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        {/* Message actions (visible on hover) */}
        <div className={cn(
          "flex items-center gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isBot ? "justify-start" : "justify-end"
        )}>
          <button 
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            onClick={() => {
              if (typeof window !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(message.content);
              }
            }}
          >
            Copy
          </button>
        </div>
      </div>
      
      {/* User Avatar - Right side */}
      {!isBot && (
        <div className="flex-shrink-0 order-2">
          <Avatar isBot={false} />
        </div>
      )}
    </div>
  );
}

// Enhanced typing indicator component
export function EnhancedTypingIndicator() {
  return (
    <div className="flex gap-3 mb-4 justify-start opacity-100 animate-fadeIn">
      <div className="flex-shrink-0">
        <Avatar isBot={true} isTyping={true} />
      </div>
      
      <div className="max-w-[80%]">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
          {/* Message bubble tail */}
          <div className="absolute top-0 left-0 -translate-x-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-200 dark:border-t-gray-700" />
          
          {/* Sender name */}
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Hafida Belayd
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          
          <TypingIndicator />
        </div>
      </div>
    </div>
  );
}
