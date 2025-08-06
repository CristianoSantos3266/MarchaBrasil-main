-- Attendance and Comments Schema for Marcha Brasil
-- Run these SQL commands in your Supabase SQL editor

-- 1. Update events table to include attendance tracking
ALTER TABLE events ADD COLUMN IF NOT EXISTS confirmed_count int DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS estimated_from_source int;
ALTER TABLE events ADD COLUMN IF NOT EXISTS source_name text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS source_url text;

-- 2. Create event_confirmations table
CREATE TABLE IF NOT EXISTS event_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now(),
  UNIQUE(event_id, user_id) -- Prevent duplicate confirmations
);

-- 3. Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  context_type text CHECK (context_type IN ('event', 'video')),
  context_id uuid, -- References events.id or videos.id
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  comment_text text NOT NULL,
  is_flagged boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- 4. Create RPC function to increment event confirmation count
CREATE OR REPLACE FUNCTION increment_event_confirmation(event_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events 
  SET confirmed_count = confirmed_count + 1 
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_confirmations_event_id ON event_confirmations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_confirmations_user_id ON event_confirmations(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_context ON comments(context_type, context_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_flagged ON comments(is_flagged);

-- 6. Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE event_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Event confirmations policies
CREATE POLICY "Users can view event confirmations" ON event_confirmations
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own confirmations" ON event_confirmations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own confirmations" ON event_confirmations
  FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view non-flagged comments" ON comments
  FOR SELECT USING (is_flagged = false);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can flag comments" ON comments
  FOR UPDATE USING (true) -- Allow any authenticated user to flag
  WITH CHECK (is_flagged = true);

-- Admin policies for comment moderation
CREATE POLICY "Admins can view all comments" ON comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete comments" ON comments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );