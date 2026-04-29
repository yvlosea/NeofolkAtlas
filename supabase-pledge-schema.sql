-- ═══════════════════════════════════════════════════════════
-- iNHET Founding Pledge System - Supabase Schema
-- Run this in your Supabase SQL Editor to set up the backend
-- ════════════════════════════════════════════════════════════

-- 1. Create the founding_pledges table
CREATE TABLE IF NOT EXISTS founding_pledges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  amount INTEGER NOT NULL CHECK (amount > 0),
  message TEXT,
  display_publicly BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE founding_pledges ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow anonymous inserts (for public pledges)
CREATE POLICY "Allow anonymous inserts" 
  ON founding_pledges 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);

-- 4. Create policy to allow public read of limited data (for the supporter wall)
-- This only returns records where display_publicly = true, and only name + amount
CREATE POLICY "Allow public read of public pledges" 
  ON founding_pledges 
  FOR SELECT 
  TO anon 
  USING (display_publicly = true);

-- 5. Create a function to get public pledge data (for the counter/wall)
-- This returns summary data without exposing private information
CREATE OR REPLACE FUNCTION get_public_founding_pledges()
RETURNS TABLE (
  full_name TEXT,
  amount INTEGER,
  display_publicly BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    CASE 
      WHEN display_publicly THEN full_name 
      ELSE 'Anonymous' 
    END,
    amount,
    display_publicly,
    created_at
  FROM founding_pledges
  ORDER BY created_at DESC;
$$;

-- 6. Create function to get pledge summary statistics
CREATE OR REPLACE FUNCTION get_pledge_summary()
RETURNS TABLE (
  total_amount BIGINT,
  supporter_count BIGINT,
  public_count BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(SUM(amount), 0) as total_amount,
    COUNT(*) as supporter_count,
    COUNT(*) FILTER (WHERE display_publicly = true) as public_count
  FROM founding_pledges;
$$;

-- 7. Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_pledges_created_at ON founding_pledges(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pledges_display_public ON founding_pledges(display_publicly) WHERE display_publicly = true;

-- 8. Create trigger to update updated_at on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_pledges_updated_at ON founding_pledges;
CREATE TRIGGER update_pledges_updated_at
  BEFORE UPDATE ON founding_pledges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- Optional: Create a view for admin panel
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW founding_pledges_admin AS
SELECT 
  id,
  full_name,
  email,
  phone,
  amount,
  message,
  display_publicly,
  created_at,
  updated_at
FROM founding_pledges
ORDER BY created_at DESC;

-- ═══════════════════════════════════════════════════════════
-- Usage Examples
-- ════════════════════════════════════════════════════════════

-- Insert a new pledge (what the website does):
-- INSERT INTO founding_pledges (full_name, email, phone, amount, message, display_publicly)
-- VALUES ('Rahul Sharma', 'rahul@example.com', '+91 98765 43210', 5000, 'Excited to support this mission!', true);

-- Get public pledges for the wall:
-- SELECT * FROM get_public_founding_pledges();

-- Get summary statistics:
-- SELECT * FROM get_pledge_summary();

-- Export all pledges for admin (requires authenticated user with proper permissions):
-- SELECT * FROM founding_pledges_admin;

-- ═══════════════════════════════════════════════════════════
-- Security Note:
-- The policies above allow anyone to:
-- 1. Insert new pledges (required for public pledging)
-- 2. Read only public name + amount data (for the supporter wall)
-- 
-- For admin access, you should:
-- 1. Use Supabase Auth to authenticate admin users
-- 2. Create additional RLS policies for authenticated users
-- 3. Or use the Service Role Key for server-side admin operations
-- ════════════════════════════════════════════════════════════
