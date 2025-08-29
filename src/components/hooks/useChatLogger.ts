import { useState, useEffect, useCallback, useRef } from 'react';

interface LogData {
  topics?: string[];
  interactionHistory?: number;
  responseLength?: number;
}

interface UseChatLoggerOptions {
  enableRealTime?: boolean;
  sessionTimeout?: number;
}

export const useChatLogger = (options: UseChatLoggerOptions = {}) => {
  const { enableRealTime = true, sessionTimeout = 30 * 60 * 1000 } = options;
  
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTouchDevice = useRef(false);

  // Detect touch device once on mount
  useEffect(() => {
    isTouchDevice.current = (typeof window !== 'undefined') && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Generate new session ID only on client side to prevent hydration mismatch
  const generateSessionId = useCallback(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for session
    timeoutRef.current = setTimeout(() => {
      setSessionId('');
    }, sessionTimeout);
    
    return newSessionId;
  }, [sessionTimeout]);

  // Initialize session on mount only on client side
  useEffect(() => {
    generateSessionId();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [generateSessionId]);

  // Log user message
  const logUserMessage = useCallback(async (content: string, data: LogData = {}) => {
    if (!enableRealTime || isTouchDevice.current) {
      // Skip logging on touch devices to prevent conflicts
      return;
    }

    setIsLogging(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          type: 'user',
          content,
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to log user message:', err);
      setError(err instanceof Error ? err.message : 'Failed to log message');
    } finally {
      setIsLogging(false);
    }
  }, [enableRealTime, sessionId]);

  // Log bot message
  const logBotMessage = useCallback(async (content: string, data: LogData = {}) => {
    if (!enableRealTime || isTouchDevice.current) {
      // Skip logging on touch devices to prevent conflicts
      return;
    }

    setIsLogging(true);
    setError(null);
    
    try {
      const response = await fetch('/api/chat/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          type: 'assistant',
          content,
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to log bot message:', err);
      setError(err instanceof Error ? err.message : 'Failed to log message');
    } finally {
      setIsLogging(false);
    }
  }, [enableRealTime, sessionId]);

  // Clear session
  const clearSession = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSessionId('');
    setError(null);
  }, []);

  // Refresh session
  const refreshSession = useCallback(() => {
    generateSessionId();
  }, [generateSessionId]);

  return {
    sessionId,
    error,
    isLogging,
    logUserMessage,
    logBotMessage,
    clearSession,
    refreshSession,
    isTouchDevice: isTouchDevice.current,
  };
}; 