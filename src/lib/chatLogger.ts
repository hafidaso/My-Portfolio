import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Types for our chat logging system
export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  created_at: string;
  session_id?: string;
  user_id?: string;
  metadata?: Record<string, any>;
}

export interface ConversationHistory {
  id: string;
  role: 'user' | 'bot';
  content: string;
  created_at: string;
  session_id?: string;
  user_id?: string;
}

export interface RecentConversation {
  session_id: string;
  last_message_at: string;
  message_count: number;
  preview: string;
}

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let supabase: any = null;

// Only create Supabase client if environment variables are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Session management
export class ChatLogger {
  private sessionId: string;

  constructor(sessionId?: string) {
    this.sessionId = sessionId || this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${uuidv4()}`;
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Store a single message
  async logMessage(message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
    if (!supabase) {
      console.warn('Supabase not configured. Message logging disabled.');
      return {
        id: `mock_${Date.now()}`,
        ...message,
        created_at: new Date().toISOString()
      } as ChatMessage;
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          role: message.role,
          content: message.content,
          session_id: this.sessionId,
          user_id: message.user_id,
          metadata: message.metadata || {}
        })
        .select()
        .single();

      if (error) {
        console.error('Error logging message:', error);
        throw new Error(`Failed to log message: ${error.message}`);
      }

      return data as ChatMessage;
    } catch (error) {
      console.error('Error in logMessage:', error);
      throw error;
    }
  }

  // Store multiple messages at once
  async logMessages(messages: Omit<ChatMessage, 'id' | 'created_at'>[]): Promise<ChatMessage[]> {
    if (!supabase) {
      console.warn('Supabase not configured. Message logging disabled.');
      return messages.map(msg => ({
        id: `mock_${Date.now()}_${Math.random()}`,
        ...msg,
        created_at: new Date().toISOString()
      })) as ChatMessage[];
    }

    try {
      const messagesWithSession = messages.map(msg => ({
        ...msg,
        session_id: this.sessionId
      }));

      const { data, error } = await supabase
        .from('messages')
        .insert(messagesWithSession)
        .select();

      if (error) {
        console.error('Error logging messages:', error);
        throw new Error(`Failed to log messages: ${error.message}`);
      }

      return data as ChatMessage[];
    } catch (error) {
      console.error('Error in logMessages:', error);
      throw error;
    }
  }

  // Get conversation history for current session
  async getConversationHistory(): Promise<ConversationHistory[]> {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty conversation history.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .rpc('get_conversation_history', {
          session_id_param: this.sessionId
        });

      if (error) {
        console.error('Error fetching conversation history:', error);
        throw new Error(`Failed to fetch conversation history: ${error.message}`);
      }

      return data as ConversationHistory[];
    } catch (error) {
      console.error('Error in getConversationHistory:', error);
      throw error;
    }
  }

  // Get conversation history for a specific session
  async getConversationHistoryBySession(sessionId: string): Promise<ConversationHistory[]> {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty conversation history.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .rpc('get_conversation_history', {
          session_id_param: sessionId
        });

      if (error) {
        console.error('Error fetching conversation history:', error);
        throw new Error(`Failed to fetch conversation history: ${error.message}`);
      }

      return data as ConversationHistory[];
    } catch (error) {
      console.error('Error in getConversationHistoryBySession:', error);
      throw error;
    }
  }

  // Get recent conversations
  async getRecentConversations(limit: number = 10): Promise<RecentConversation[]> {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty recent conversations.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .rpc('get_recent_conversations', {
          limit_count: limit
        });

      if (error) {
        console.error('Error fetching recent conversations:', error);
        throw new Error(`Failed to fetch recent conversations: ${error.message}`);
      }

      return data as RecentConversation[];
    } catch (error) {
      console.error('Error in getRecentConversations:', error);
      throw error;
    }
  }

  // Get messages by user ID
  async getMessagesByUserId(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty messages.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching messages by user ID:', error);
        throw new Error(`Failed to fetch messages by user ID: ${error.message}`);
      }

      return data as ChatMessage[];
    } catch (error) {
      console.error('Error in getMessagesByUserId:', error);
      throw error;
    }
  }

  // Delete messages by session ID
  async deleteSession(sessionId: string): Promise<void> {
    if (!supabase) {
      console.warn('Supabase not configured. Session deletion skipped.');
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error deleting session:', error);
        throw new Error(`Failed to delete session: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteSession:', error);
      throw error;
    }
  }

  // Get analytics data
  async getAnalytics(): Promise<any> {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty analytics.');
      return [];
    }

    try {
      const { data, error } = await supabase
        .from('message_analytics')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('Error fetching analytics:', error);
        throw new Error(`Failed to fetch analytics: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getAnalytics:', error);
      throw error;
    }
  }

  // Real-time subscription for new messages
  subscribeToNewMessages(callback: (message: ChatMessage) => void) {
    if (!supabase) {
      console.warn('Supabase not configured. Real-time subscriptions disabled.');
      return null;
    }

    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `session_id=eq.${this.sessionId}`
        },
        (payload: any) => {
          callback(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }

  // Unsubscribe from real-time updates
  unsubscribe(channel: any) {
    if (!supabase || !channel) {
      return;
    }
    supabase.removeChannel(channel);
  }
}

// Utility function to create a new chat logger instance
export const createChatLogger = (sessionId?: string): ChatLogger => {
  return new ChatLogger(sessionId);
};

// Export the supabase client for direct use if needed
export { supabase }; 