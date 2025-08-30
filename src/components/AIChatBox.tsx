import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, SendHorizontal, Trash, XCircle, Sparkles, History, Database } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

import { useChatLogger } from "./hooks/useChatLogger";
import ChatHistory from "./ChatHistory";
import { smartSuggestionGenerator, FollowUpSuggestion, SuggestionContext } from "@/lib/smartSuggestions";
import EnhancedChatMessage, { EnhancedTypingIndicator } from "./EnhancedChatMessage";

interface AIChatBoxProps {
  open: boolean;
  onClose: () => void;
}

export default function AIChatBox({ open, onClose }: AIChatBoxProps) {
  const [interactionHistory, setInteractionHistory] = useState<string[]>([]);
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const [conversationTopics, setConversationTopics] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showLoggingStatus, setShowLoggingStatus] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [smartSuggestions, setSmartSuggestions] = useState<FollowUpSuggestion[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  // Generate unique IDs on client side to prevent hydration mismatch
  const generateId = useCallback(() => {
    setIdCounter(prev => prev + 1);
    return `msg_${idCounter}_${Date.now()}`;
  }, [idCounter]);

  // Generate session ID only on client side to prevent hydration mismatch
  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  // Enhanced close function with debugging - memoized to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    console.log('🔒 ChatBox close function called');
    try {
      onClose();
      console.log('✅ ChatBox closed successfully');
    } catch (error) {
      console.error('❌ Error closing ChatBox:', error);
    }
  }, [onClose]);

  // Initialize chat logger
  const {
    logUserMessage,
    logBotMessage,
    sessionId: loggerSessionId,
    error: loggingError
  } = useChatLogger({
    enableRealTime: true
  });

  // Enhanced message handling with debugging
  const handleMessageReceived = (message: Message) => {
    if (message.role === 'assistant') {
      console.log('🤖 Bot message received:', message.content);
      debugMessageContent(message.content);
    }
  };

  // Enhanced onFinish function with debugging
  const originalOnFinish = async (message: Message) => {
    console.log('Chat finished successfully');
    setIsTyping(false);
    
    // Debug the message content
    handleMessageReceived(message);
    
    // Log the message to Supabase
    try {
      if (message.role === 'user') {
        await logUserMessage(message.content, {
          topics: extractTopics(message.content),
          interactionHistory: interactionHistory.length
        });
        
        // Update interaction history with user messages
        const newHistory = [...interactionHistory, message.content];
        setInteractionHistory(newHistory);
        
        // Track conversation topics
        const topics = extractTopics(message.content);
        setConversationTopics((prev: Set<string>) => new Set([...prev, ...topics]));
      } else if (message.role === 'assistant') {
        await logBotMessage(message.content, {
          topics: Array.from(conversationTopics),
          responseLength: message.content.length
        });
      }
    } catch (error) {
      console.error('Failed to log message:', error);
      setShowLoggingStatus(true);
      setTimeout(() => setShowLoggingStatus(false), 3000);
    }
  };

  // chat-related states and functions from useChat hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
    streamProtocol: 'text', // Use plain text streaming
    body: {
      interactionHistory,
      userPreferences,
      sessionId
    },
    onResponse: (response: Response) => {
      if (!response.ok) {
        console.error('Response error:', response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onFinish: originalOnFinish,
    onError: (error: Error) => {
      console.error("Chat error:", error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `An error occurred: ${error?.message || 'Something went wrong. Please try refreshing the page if this persists.'}`,
      };
      setMessages([...messages, errorMessage]);
    }
  });

  // Extract topics from user messages
  const extractTopics = (message: string): string[] => {
    const topics: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('logo') || lowerMessage.includes('design') || lowerMessage.includes('branding')) {
      topics.push('design');
    }
    if (lowerMessage.includes('video') || lowerMessage.includes('motion') || lowerMessage.includes('promo')) {
      topics.push('video');
    }
    if (lowerMessage.includes('data') || lowerMessage.includes('analysis') || lowerMessage.includes('python')) {
      topics.push('data');
    }
    if (lowerMessage.includes('website') || lowerMessage.includes('web') || lowerMessage.includes('react')) {
      topics.push('web');
    }
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      topics.push('pricing');
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('linkedin')) {
      topics.push('contact');
    }
    
    return topics;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, messageOverride?: string) => {
    e.preventDefault();
    
    // Use messageOverride if provided, otherwise use input
    const messageToSend = messageOverride || input;
    console.log('💬 handleSubmit called with message:', messageToSend);
    
    if (!messageToSend?.trim()) {
      console.log('❌ No message to send');
      return;
    }
    
    setIsTyping(true);
    
    try {
      // If using messageOverride, we need to manually handle the chat flow
      if (messageOverride) {
        console.log('🤖 Making API call with override message...');
        
        // Add user message to chat
        const userMessage: Message = {
          id: generateId(),
          role: "user", 
          content: messageToSend
        };
        
        // Update messages with user message
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        
        // Make API call
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
            sessionId: sessionId
          })
        });
        
        if (response.ok) {
          const aiResponse = await response.text();
          const aiMessage: Message = {
            id: generateId(),
            role: "assistant",
            content: aiResponse
          };
          
          setMessages([...updatedMessages, aiMessage]);
          await logBotMessage(aiResponse, {
            topics: Array.from(conversationTopics),
            responseLength: aiResponse.length
          });
        } else {
          throw new Error('API call failed');
        }
      } else {
        // Use the normal flow for regular input
        await originalHandleSubmit(e);
      }
    
      setIsTyping(false);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setIsTyping(false);
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Failed to send message: ${err?.message || 'Please try again.'}`,
      };
      setMessages([...messages, errorMessage]);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Function to handle quick action button clicks
  const handleSend = (message: string) => {
    console.log('🚀 handleSend called with message:', message);
    
    // Create a synthetic form event and call handleSubmit directly with the message
    const syntheticEvent = {
      preventDefault: () => {},
      currentTarget: null,
      target: null
    } as any;
    
    // Directly call handleSubmit with the message
    handleSubmit(syntheticEvent, message);
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate smart suggestions when new AI response arrives
  useEffect(() => {
    if (messages.length >= 2) {
      const lastUserMessage = messages.filter(m => m.role === 'user').slice(-1)[0];
      const lastAiMessage = messages.filter(m => m.role === 'assistant').slice(-1)[0];
      
      if (lastUserMessage && lastAiMessage) {
        console.log('🤖 Generating smart suggestions for:', lastUserMessage.content);
        
        const context: SuggestionContext = {
          userMessage: lastUserMessage.content,
          aiResponse: lastAiMessage.content,
          conversationHistory: messages.slice(-6).map(m => ({ 
            role: m.role as "user" | "assistant", 
            content: m.content 
          })),
          topics: Array.from(conversationTopics)
        };
        
        const suggestions = smartSuggestionGenerator.generateSuggestions(context);
        console.log('💡 Generated suggestions:', suggestions);
        setSmartSuggestions(suggestions);
        
        // Extract and update conversation topics
        const newTopics = smartSuggestionGenerator.extractTopics(context);
        setConversationTopics(prev => new Set([...prev, ...newTopics]));
      }
    } else {
      // Clear suggestions when conversation is empty
      setSmartSuggestions([]);
    }
  }, [messages, conversationTopics]);

  // Auto-focus input when chat box is opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Add click outside handler for better mobile/tablet experience - fixed memory leak
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element;
      
      // Don't close if clicking on navigation elements
      if (target.closest('nav') || target.closest('a') || target.closest('[role="navigation"]')) {
        return;
      }
      
      // Don't close if clicking on the chat box itself
      if (open && !target.closest('.chat-box-container')) {
        console.log('🖱️ Click outside detected, closing chat');
        handleClose();
      }
    };

    if (open) {
      // Use passive listeners for better performance
      document.addEventListener('mousedown', handleClickOutside, { passive: true });
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [open, handleClose]);

  // Add passive touch events for better mobile performance
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Prevent default only when necessary
      if (e.target && (e.target as Element).closest('button')) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Determine if the last message is from the user
  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  // Generate conversation summary for context
  const getConversationSummary = () => {
    const topics = Array.from(conversationTopics);
    if (topics.length === 0) return null;
    
    return (
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <Sparkles size={12} />
        <span>Topics: {topics.join(', ')}</span>
      </div>
    );
  };

  // Debug function to check message content for links
  const debugMessageContent = (content: string) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const urlRegex = /https?:\/\/[^\s]+/g;
    
    console.log('🔍 Debugging message content:', content);
    
    // Check for markdown links
    const markdownLinks = [...content.matchAll(linkRegex)];
    if (markdownLinks.length > 0) {
      console.log('🔗 Found markdown links:', markdownLinks);
    }
    
    // Check for plain URLs
    const plainUrls = content.match(urlRegex);
    if (plainUrls) {
      console.log('🔗 Found plain URLs:', plainUrls);
    }
    
    // Check for any link-like text
    if (content.includes('http') || content.includes('www') || content.includes('linkedin.com') || content.includes('github.com')) {
      console.log('🔗 Content contains potential links');
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-16 right-4 z-40 w-full max-w-[500px] p-4 xl:right-22 chat-box-container",
        "sm:bottom-20 sm:right-6 sm:max-w-[450px]",
        "md:bottom-16 md:right-4 md:max-w-[500px]",
        "lg:bottom-16 lg:right-4 lg:max-w-[500px]",
        "xl:bottom-16 xl:right-4 xl:max-w-[500px]",
        "2xl:bottom-16 2xl:right-4 2xl:max-w-[500px]",
        open ? "block" : "hidden",
      )}
      style={{ 
        zIndex: 40,
        touchAction: 'manipulation',
        WebkitTransform: 'translateZ(0)', // Force hardware acceleration on iOS
        transform: 'translateZ(0)'
      }}
    >
      <div className="flex h-[600px] sm:h-[550px] md:h-[600px] lg:h-[600px] xl:h-[600px] 2xl:h-[600px] flex-col border bg-background shadow-2xl rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 p-4 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="flex items-center gap-3 relative z-10">
            {/* Professional avatar */}
            <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 flex items-center justify-center">
              <Bot size={20} className="text-white drop-shadow-sm" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-white font-bold text-lg drop-shadow-sm truncate">Hafida Belayd</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg" />
                <span className="text-white text-xs opacity-90 truncate">AI Assistant</span>
              </div>
            </div>
            {conversationTopics.size > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Sparkles size={14} className="text-purple-300" />
                <span className="text-xs text-purple-300">
                  {Array.from(conversationTopics).length} topics
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className="p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white hover:bg-opacity-20 transition-all duration-200 hover:scale-105 active:scale-95 min-h-[48px] min-w-[48px] touch-manipulation"
              title="Show chat history"
              aria-label="Show chat history"
              type="button"
              style={{ touchAction: 'manipulation' }}
            >
              <History size={20} />
            </button>
            <button 
              onClick={handleClose} 
              className="p-3 rounded-full bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 text-white hover:bg-opacity-20 transition-all duration-200 hover:scale-105 active:scale-95 min-h-[48px] min-w-[48px] touch-manipulation"
              title="Close chat"
              aria-label="Close chat"
              type="button"
              style={{ touchAction: 'manipulation' }}
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
        
        <div className="mt-3 h-full overflow-y-auto px-3 py-2 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-gray-900/50" ref={scrollRef} style={{ WebkitOverflowScrolling: 'touch' }}>
          {showHistory ? (
            <ChatHistory 
              sessionId={loggerSessionId}
              maxHeight="500px"
              showSessionSelector={false}
              showSearch={true}
              showFilters={true}
            />
          ) : (
            <>
              {messages.map((message, index) => (
                <EnhancedChatMessage 
                  message={message} 
                  key={message.id} 
                  isLatest={index === messages.length - 1 && message.role === 'assistant'}
                />
              ))}
            </>
          )}
          
          {(isLoading || isTyping) && lastMessageIsUser && (
            <EnhancedTypingIndicator />
          )}
          
          {error && (
            <EnhancedChatMessage
              message={{
                id: "error",
                role: "assistant",
                content: error?.message || "Something went wrong. Please try again!",
              }}
            />
          )}
          
          {!error && messages.length === 0 && !showHistory && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
              {/* Enhanced welcome animation */}
              <div className="relative mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                  <Bot size={32} className="sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full blur opacity-30 animate-pulse" />
              </div>
              
              <div className="mb-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-700 dark:text-green-300 text-xs sm:text-sm rounded-full border border-green-200 dark:border-green-700 shadow-sm">
                🤖 AI-Powered Assistant
              </div>
              
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 px-2">
                Hi! I'm Hafida Belayd
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed max-w-sm px-2">
                I'm here to help you learn about my work and expertise. Ask me anything about my projects, skills, or how we can work together!
              </p>
              
              {/* Quick Action Buttons */}
              <div className="w-full max-w-md space-y-3 sm:space-y-4 px-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                  👋 Ask me about...
                </div>
                
                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4">
                  <button 
                    onClick={() => handleSend("Tell me about your data science projects and machine learning experience")}
                    className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 transition-all duration-200 group touch-manipulation"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="text-base sm:text-lg">📊</span>
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium truncate">Data Science</div>
                      <div className="text-xs opacity-75 truncate">ML & Analytics</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleSend("What creative design services do you offer? Show me your design portfolio")}
                    className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-300 rounded-lg hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 transition-all duration-200 group touch-manipulation"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="text-base sm:text-lg">🎨</span>
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium truncate">Design</div>
                      <div className="text-xs opacity-75 truncate">Graphics & Branding</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleSend("Tell me about your web development skills and projects")}
                    className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-300 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40 transition-all duration-200 group touch-manipulation"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="text-base sm:text-lg">💻</span>
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium truncate">Web Dev</div>
                      <div className="text-xs opacity-75 truncate">React & Full-stack</div>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleSend("How can I contact you for a project? What are your rates and availability?")}
                    className="flex items-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-700 dark:text-orange-300 rounded-lg hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/40 transition-all duration-200 group touch-manipulation"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="text-base sm:text-lg">📞</span>
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium truncate">Contact</div>
                      <div className="text-xs opacity-75 truncate">Hire & Rates</div>
                    </div>
                  </button>
                </div>
                
                {/* Secondary Quick Questions */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <button 
                      onClick={() => handleSend("What programming languages and tools do you use?")}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      🛠️ Skills & Tools
                    </button>
                    <button 
                      onClick={() => handleSend("Show me your most impressive projects")}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      ⭐ Top Projects
                    </button>
                    <button 
                      onClick={() => handleSend("What's your educational background and certifications?")}
                      className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      🎓 Education
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Smart Follow-up Suggestions */}
          {messages.length > 0 && !isLoading && !showHistory && smartSuggestions.length > 0 && (
            <div className="mt-4 px-3">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">
                💡 You might also want to know...
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {smartSuggestions.map((suggestion) => (
                  <button 
                    key={suggestion.id}
                    onClick={() => handleSend(suggestion.text)}
                    className={cn(
                      "flex items-center gap-2 p-2 text-xs rounded-lg transition-all duration-200 text-left touch-manipulation",
                      "hover:scale-[1.02] active:scale-[0.98]",
                      suggestion.category === 'technical' && "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40",
                      suggestion.category === 'project' && "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/40",
                      suggestion.category === 'collaboration' && "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/40",
                      suggestion.category === 'details' && "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-800/40",
                      suggestion.category === 'portfolio' && "bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-800/40"
                    )}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <span className="text-sm flex-shrink-0">{suggestion.icon}</span>
                    <span className="flex-1 leading-tight">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
          <form onSubmit={handleSubmit} className="flex gap-2" data-role="chat-form">
          <button
            type="button"
            className="flex w-10 h-10 flex-none items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 text-gray-500 hover:text-red-500 transition-all duration-200 hover:scale-105 active:scale-95 min-h-[48px] min-w-[48px] touch-manipulation"
            title="Clear chat"
            onClick={() => {
              setMessages([]);
              setInteractionHistory([]);
              setConversationTopics(new Set());
              setUserPreferences([]);
              setSmartSuggestions([]);
              setShowHistory(false);
              setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
            }}
            style={{ touchAction: 'manipulation' }}
          >
            <Trash size={18} />
          </button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything about Hafida's work, skills, or projects..."
            className="flex-1 min-h-[48px] px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400 transition-all duration-200 touch-manipulation"
            ref={inputRef}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{ 
              touchAction: 'manipulation',
              WebkitAppearance: 'none',
              appearance: 'none'
            }}
          />
          <button
            type="submit"
            className={cn(
              "flex min-w-[48px] min-h-[48px] w-12 h-12 items-center justify-center rounded-lg transition-all duration-200 touch-manipulation",
              "disabled:pointer-events-none disabled:opacity-50",
              input && !isLoading 
                ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:scale-105 shadow-lg hover:shadow-xl active:scale-95" 
                : "bg-gray-200 dark:bg-gray-600 text-gray-400"
            )}
            disabled={!input || isLoading}
            aria-label="Send message"
            style={{ touchAction: 'manipulation' }}
          >
            <SendHorizontal size={20} className={isLoading ? "animate-pulse" : ""} />
          </button>
          
          {/* Additional close button for iPad accessibility */}
          <button
            type="button"
            onClick={handleClose}
            className="flex min-w-[48px] min-h-[48px] w-12 h-12 items-center justify-center rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 active:scale-95 touch-manipulation ml-2"
            title="Close chat"
            aria-label="Close chat"
            style={{ touchAction: 'manipulation' }}
          >
            <XCircle size={20} />
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}


