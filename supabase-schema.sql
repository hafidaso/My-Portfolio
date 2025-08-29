-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create messages table for chatbot interactions
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL CHECK (role IN ('user', 'bot')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id TEXT,
    user_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);

-- Create a function to get conversation history by session
CREATE OR REPLACE FUNCTION get_conversation_history(session_id_param TEXT)
RETURNS TABLE (
    id UUID,
    role TEXT,
    content TEXT,
    created_at TIMESTAMPTZ,
    session_id TEXT,
    user_id TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.role,
        m.content,
        m.created_at,
        m.session_id,
        m.user_id
    FROM messages m
    WHERE m.session_id = session_id_param
    ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get recent conversations
CREATE OR REPLACE FUNCTION get_recent_conversations(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    session_id TEXT,
    last_message_at TIMESTAMPTZ,
    message_count BIGINT,
    preview TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.session_id,
        MAX(m.created_at) as last_message_at,
        COUNT(*) as message_count,
        STRING_AGG(
            CASE 
                WHEN m.role = 'user' THEN 'User: ' || LEFT(m.content, 50)
                ELSE 'Bot: ' || LEFT(m.content, 50)
            END,
            ' | ' ORDER BY m.created_at
        ) as preview
    FROM messages m
    WHERE m.session_id IS NOT NULL
    GROUP BY m.session_id
    ORDER BY MAX(m.created_at) DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
-- Allow all operations for now (you can restrict this based on your needs)
CREATE POLICY "Allow all operations on messages" ON messages
    FOR ALL USING (true);

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW message_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    role,
    COUNT(*) as message_count,
    AVG(LENGTH(content)) as avg_message_length,
    COUNT(DISTINCT session_id) as unique_sessions
FROM messages
GROUP BY DATE_TRUNC('day', created_at), role
ORDER BY date DESC, role; 