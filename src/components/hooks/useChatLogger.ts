import { useEffect, useRef, useState, useCallback } from 'react';
import { ChatLogger, createChatLogger, ChatMessage, ConversationHistory, RecentConversation } from '../../lib/chatLogger';

interface UseChatLoggerOptions {
  sessionId?: string;
  userId?: string;
  enableRealTime?: boolean;
  autoLoadHistory?: boolean;
}

interface UseChatLoggerReturn {
  // Core logging functions
  logUserMessage: (content: string, metadata?: Record<string, any>) => Promise<ChatMessage>;
  logBotMessage: (content: string, metadata?: Record<string, any>) => Promise<ChatMessage>;
  logMessages: (messages: Array<{ role: 'user' | 'bot'; content: string; metadata?: Record<string, any> }>) => Promise<ChatMessage[]>;
  
  // Session management
  sessionId: string;
  setSessionId: (sessionId: string) => void;
  clearSession: () => void;
  
  // Data retrieval
  conversationHistory: ConversationHistory[];
  recentConversations: RecentConversation[];
  isLoading: boolean;
  error: string | null;
  
  // History management
  loadConversationHistory: () => Promise<void>;
  loadRecentConversations: (limit?: number) => Promise<void>;
  loadHistoryBySession: (sessionId: string) => Promise<void>;
  
  // Real-time features
  isRealTimeEnabled: boolean;
  enableRealTime: () => void;
  disableRealTime: () => void;
  
  // Analytics
  getAnalytics: () => Promise<any>;
  
  // Utility
  refresh: () => void;
}

export function useChatLogger(options: UseChatLoggerOptions = {}): UseChatLoggerReturn {
  const {
    sessionId: initialSessionId,
    userId,
    enableRealTime: initialEnableRealTime = false,
    autoLoadHistory = false
  } = options;

  const [chatLogger] = useState(() => createChatLogger(initialSessionId));
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(initialEnableRealTime);
  
  const realTimeChannelRef = useRef<any>(null);

  // Session management
  const setSessionId = useCallback((sessionId: string) => {
    // Create a new chat logger with the new session ID
    const newLogger = createChatLogger(sessionId);
    Object.assign(chatLogger, newLogger);
  }, [chatLogger]);

  const clearSession = useCallback(() => {
    setConversationHistory([]);
    setError(null);
  }, []);

  // Core logging functions
  const logUserMessage = useCallback(async (content: string, metadata?: Record<string, any>): Promise<ChatMessage> => {
    try {
      setError(null);
      const message = await chatLogger.logMessage({
        role: 'user',
        content,
        user_id: userId,
        metadata
      });
      
      // Update local state if real-time is disabled
      if (!isRealTimeEnabled) {
        setConversationHistory(prev => [...prev, message]);
      }
      
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log user message';
      setError(errorMessage);
      throw err;
    }
  }, [chatLogger, userId, isRealTimeEnabled]);

  const logBotMessage = useCallback(async (content: string, metadata?: Record<string, any>): Promise<ChatMessage> => {
    try {
      setError(null);
      const message = await chatLogger.logMessage({
        role: 'bot',
        content,
        user_id: userId,
        metadata
      });
      
      // Update local state if real-time is disabled
      if (!isRealTimeEnabled) {
        setConversationHistory(prev => [...prev, message]);
      }
      
      return message;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log bot message';
      setError(errorMessage);
      throw err;
    }
  }, [chatLogger, userId, isRealTimeEnabled]);

  const logMessages = useCallback(async (messages: Array<{ role: 'user' | 'bot'; content: string; metadata?: Record<string, any> }>): Promise<ChatMessage[]> => {
    try {
      setError(null);
      const loggedMessages = await chatLogger.logMessages(
        messages.map(msg => ({
          ...msg,
          user_id: userId
        }))
      );
      
      // Update local state if real-time is disabled
      if (!isRealTimeEnabled) {
        setConversationHistory(prev => [...prev, ...loggedMessages]);
      }
      
      return loggedMessages;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log messages';
      setError(errorMessage);
      throw err;
    }
  }, [chatLogger, userId, isRealTimeEnabled]);

  // Data retrieval functions
  const loadConversationHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await chatLogger.getConversationHistory();
      setConversationHistory(history);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [chatLogger]);

  const loadRecentConversations = useCallback(async (limit: number = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      const conversations = await chatLogger.getRecentConversations(limit);
      setRecentConversations(conversations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recent conversations';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [chatLogger]);

  const loadHistoryBySession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const history = await chatLogger.getConversationHistoryBySession(sessionId);
      setConversationHistory(history);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load session history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [chatLogger]);

  // Real-time management
  const enableRealTime = useCallback(() => {
    if (realTimeChannelRef.current) {
      return; // Already enabled
    }

    realTimeChannelRef.current = chatLogger.subscribeToNewMessages((message) => {
      setConversationHistory(prev => [...prev, message]);
    });
    
    setIsRealTimeEnabled(true);
  }, [chatLogger]);

  const disableRealTime = useCallback(() => {
    if (realTimeChannelRef.current) {
      chatLogger.unsubscribe(realTimeChannelRef.current);
      realTimeChannelRef.current = null;
    }
    setIsRealTimeEnabled(false);
  }, [chatLogger]);

  // Analytics
  const getAnalytics = useCallback(async () => {
    try {
      setError(null);
      return await chatLogger.getAnalytics();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get analytics';
      setError(errorMessage);
      throw err;
    }
  }, [chatLogger]);

  // Utility
  const refresh = useCallback(() => {
    loadConversationHistory();
    loadRecentConversations();
  }, [loadConversationHistory, loadRecentConversations]);

  // Auto-load history on mount
  useEffect(() => {
    if (autoLoadHistory) {
      loadConversationHistory();
      loadRecentConversations();
    }
  }, [autoLoadHistory, loadConversationHistory, loadRecentConversations]);

  // Real-time setup
  useEffect(() => {
    if (isRealTimeEnabled) {
      enableRealTime();
    }

    return () => {
      if (realTimeChannelRef.current) {
        disableRealTime();
      }
    };
  }, [isRealTimeEnabled, enableRealTime, disableRealTime]);

  return {
    // Core logging functions
    logUserMessage,
    logBotMessage,
    logMessages,
    
    // Session management
    sessionId: chatLogger.getSessionId(),
    setSessionId,
    clearSession,
    
    // Data retrieval
    conversationHistory,
    recentConversations,
    isLoading,
    error,
    
    // History management
    loadConversationHistory,
    loadRecentConversations,
    loadHistoryBySession,
    
    // Real-time features
    isRealTimeEnabled,
    enableRealTime,
    disableRealTime,
    
    // Analytics
    getAnalytics,
    
    // Utility
    refresh
  };
} 