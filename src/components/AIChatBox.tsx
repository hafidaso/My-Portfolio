import { cn } from "@/lib/utils";
import { Message, useChat } from "ai/react";
import { Bot, SendHorizontal, Trash, XCircle, Sparkles, History, Database } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useChatLogger } from "./hooks/useChatLogger";
import ChatHistory from "./ChatHistory";

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

  // Initialize chat logger
  const {
    logUserMessage,
    logBotMessage,
    sessionId,
    error: loggingError
  } = useChatLogger({
    enableRealTime: true
  });

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
      userPreferences
    },
    onResponse: (response: Response) => {
      if (!response.ok) {
        console.error('Response error:', response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    },
    onFinish: async (message: Message) => {
      console.log('Chat finished successfully');
      setIsTyping(false);
      
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
    },
    onError: (error: Error) => {
      console.error("Chat error:", error);
      setIsTyping(false);
      const errorMessage: Message = {
        id: Date.now().toString(),
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsTyping(true);
    
    try {
      await originalHandleSubmit(e);
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setIsTyping(false);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Failed to send message: ${err?.message || 'Please try again.'}`,
      };
      setMessages([...messages, errorMessage]);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus input when chat box is opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

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

  return (
    <div
      className={cn(
        "fixed bottom-16 right-4 z-50 w-full max-w-[500px] p-4 xl:right-22",
        open ? "block" : "hidden",
      )}
    >
      <div className="flex h-[600px] flex-col border bg-background shadow-xl rounded-lg overflow-hidden">
        <div className="flex items-center justify-between bg-black bg-opacity-30 p-4">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold">Hafida Belayd</h2>
            {conversationTopics.size > 0 && (
              <div className="flex items-center gap-1">
                <Sparkles size={14} className="text-purple-300" />
                <span className="text-xs text-purple-300">
                  {Array.from(conversationTopics).length} topics
                </span>
              </div>
            )}
            {loggingError && (
              <div className="flex items-center gap-1">
                <Database size={14} className="text-red-300" />
                <span className="text-xs text-red-300">Logging Error</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className="text-white hover:text-gray-300 transition-colors"
              title="Show chat history"
            >
              <History size={20} />
            </button>
            <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
              <XCircle size={24} />
            </button>
          </div>
        </div>
        
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {showHistory ? (
            <ChatHistory 
              sessionId={sessionId}
              maxHeight="500px"
              showSessionSelector={false}
              showSearch={true}
              showFilters={true}
            />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage message={message} key={message.id} />
              ))}
            </>
          )}
          
          {(isLoading || isTyping) && lastMessageIsUser && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Bot className="flex-none" />
                <div className="flex items-center gap-1">
                  <div className="animate-bounce">●</div>
                  <div className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</div>
                  <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <ChatMessage
              message={{
                id: "error",
                role: "assistant",
                content: error?.message || "Something went wrong. Please try again!",
              }}
            />
          )}
          
          {!error && messages.length === 0 && !showHistory && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot size={48} className="text-purple-500 mb-4 animate-bounce" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Hi! I'm Hafida Belayd, a multidisciplinary professional specializing in graphic design, video production, data analysis, and web development. Ask me anything about my work, skills, or how I can help with your projects!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button 
                  onClick={() => {
                    const event = { target: { value: "Tell me about your design services" } } as any;
                    handleInputChange(event);
                  }}
                  className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                >
                  Design Services
                </button>
                <button 
                  onClick={() => {
                    const event = { target: { value: "What data science projects have you worked on?" } } as any;
                    handleInputChange(event);
                  }}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  Data Projects
                </button>
                <button 
                  onClick={() => {
                    const event = { target: { value: "Show me your portfolio" } } as any;
                    handleInputChange(event);
                  }}
                  className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-3 py-1 rounded-full hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                >
                  Portfolio
                </button>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <button
            type="button"
            className="flex w-10 flex-none items-center justify-center hover:text-red-500 transition-colors duration-300"
            title="Clear chat"
            onClick={() => {
              setMessages([]);
              setInteractionHistory([]);
              setConversationTopics(new Set());
              setUserPreferences([]);
              setShowHistory(false);
            }}
          >
            <Trash size={24} />
          </button>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me about design, data, web development..."
            className="flex-grow rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ref={inputRef}
          />
          <button
            type="submit"
            className="flex w-10 flex-none items-center justify-center disabled:opacity-50 hover:text-orange-400 transition-colors duration-300"
            disabled={input.length === 0 || isLoading}
            title="Submit message"
          >
            <SendHorizontal size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

// Component to display individual chat messages
interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAiMessage = role === "assistant";

  return (
    <div
      className={cn(
        "mb-3 flex items-start",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && (
        <div className="mr-2 flex-none mt-1">
          <Bot className="text-purple-500" size={20} />
        </div>
      )}
      <div
        className={cn(
          "rounded-md border px-3 py-2 max-w-[80%]",
          isAiMessage 
            ? "bg-background border-purple-200 dark:border-purple-800" 
            : "bg-foreground text-background",
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ref, ...props }) => (
              <Link
                {...props}
                href={props.href ?? ""}
                className="text-primary hover:underline"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="mt-3 first:mt-0" />
            ),
            ul: ({ node, ...props }) => (
              <ul
                {...props}
                className="mt-3 list-inside list-disc first:mt-0"
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                {...props}
                className="mt-3 list-inside list-decimal first:mt-0"
              />
            ),
            li: ({ node, ...props }) => <li {...props} className="mt-1 ml-6" />,
            blockquote: ({ node, ...props }) => (
              <blockquote {...props} className="text-primary border-l-4 border-purple-300 pl-4 italic" />
            ),
            code: ({ node, ...props }) => {
              const { inline } = node as any;
              return (
                <code
                  {...props}
                  className={`rounded p-1 ${inline ? 'inline-block bg-gray-100 dark:bg-gray-800' : 'block bg-gray-100 dark:bg-gray-800 p-2'} mt-3 first:mt-0 text-primary`}
                />
              );
            },
            pre: ({ node, ...props }) => (
              <pre {...props} className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-auto mt-3 first:mt-0" />
            ),
            h1: ({ node, ...props }) => (
              <h1 {...props} className="text-3xl font-bold mt-4 first:mt-0" />
            ),
            h2: ({ node, ...props }) => (
              <h2 {...props} className="text-2xl font-bold mt-3 first:mt-0" />
            ),
            h3: ({ node, ...props }) => (
              <h3 {...props} className="text-xl font-bold mt-3 first:mt-0" />
            ),
            h4: ({ node, ...props }) => (
              <h4 {...props} className="text-lg font-bold mt-3 first:mt-0" />
            ),
            h5: ({ node, ...props }) => (
              <h5 {...props} className="text-base font-bold mt-3 first:mt-0" />
            ),
            h6: ({ node, ...props }) => (
              <h6 {...props} className="text-sm font-bold mt-3 first:mt-0" />
            ),
            table: ({ node, ...props }) => (
              <table {...props} className="w-full mt-3 border-collapse border border-gray-200 dark:border-gray-700 first:mt-0" />
            ),
            thead: ({ node, ...props }) => (
              <thead {...props} className="bg-gray-100 dark:bg-gray-800" />
            ),
            tbody: ({ node, ...props }) => (
              <tbody {...props} />
            ),
            tr: ({ node, ...props }) => (
              <tr {...props} className="border-t border-gray-200 dark:border-gray-700" />
            ),
            th: ({ node, ...props }) => (
              <th {...props} className="px-4 py-2 text-left font-semibold" />
            ),
            td: ({ node, ...props }) => (
              <td {...props} className="px-4 py-2" />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
