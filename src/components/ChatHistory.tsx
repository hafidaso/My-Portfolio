import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Filter, Calendar, User, Bot, Clock, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatLogger } from './hooks/useChatLogger';

interface ChatHistoryProps {
  className?: string;
  sessionId?: string;
  userId?: string;
}

export default function ChatHistory({ className, sessionId, userId }: ChatHistoryProps) {
  const {
    sessionId: currentSessionId,
    error,
    isLogging,
    logUserMessage,
    logBotMessage,
    clearSession,
    refreshSession
  } = useChatLogger({
    enableRealTime: true,
    sessionTimeout: 30 * 60 * 1000
  });

  const [selectedSession, setSelectedSession] = useState<string>(currentSessionId);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'bot'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // Mock data for demonstration - replace with actual data from your backend
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter messages based on search and filters
  const filteredMessages = (conversationHistory || []).filter((message: any) => {
    // Search filter
    if (searchTerm && !message.content.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Role filter
    if (roleFilter !== 'all' && message.role !== roleFilter) {
      return false;
    }

    // Date filter
    if (dateFilter !== 'all') {
      const messageDate = new Date(message.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - messageDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case 'today':
          if (diffDays > 1) return false;
          break;
        case 'week':
          if (diffDays > 7) return false;
          break;
        case 'month':
          if (diffDays > 30) return false;
          break;
      }
    }

    return true;
  });

  // Load conversation when session changes
  useEffect(() => {
    if (selectedSession && selectedSession !== currentSessionId) {
      // Mock loading - replace with actual API call
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [selectedSession, currentSessionId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (error) {
    return (
      <div className={cn("p-4 border border-red-200 bg-red-50 rounded-lg", className)}>
        <div className="flex items-center gap-2 text-red-600">
          <MessageSquare size={16} />
          <span className="text-sm">Error loading chat history: {error}</span>
        </div>
        <button
          onClick={refreshSession}
          className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg bg-white dark:bg-gray-800", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-purple-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Chat History</h3>
            {isLoading && (
              <Clock size={16} className="animate-spin text-gray-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshSession}
              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Refresh"
            >
              <Clock size={16} />
            </button>
            <button
              onClick={clearSession}
              className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Clear session"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Session Selector */}
        {recentConversations.length > 0 && (
          <div className="mt-3">
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {recentConversations.map((conversation) => (
                <option key={conversation.session_id} value={conversation.session_id}>
                  {formatDate(conversation.last_message_at)} - {conversation.message_count} messages
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mt-3 space-y-2">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'bot')}
              className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All messages</option>
              <option value="user">User messages</option>
              <option value="bot">Bot messages</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
              className="flex-1 p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All time</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        className="overflow-y-auto p-4"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Clock size={20} className="animate-spin" />
                <span>Loading messages...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <MessageSquare size={32} />
                <span>No messages found</span>
                {searchTerm && (
                  <span className="text-sm">Try adjusting your search or filters</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {message.role === 'user' ? 'You' : 'Hafida'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{formatTime(message.created_at)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-between">
          <span>
            {filteredMessages.length} of {conversationHistory.length} messages
          </span>
          <span>
            Session: {currentSessionId.slice(0, 8)}...
          </span>
        </div>
      </div>
    </div>
  );
} 