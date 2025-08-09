-- Production Database Setup for Marcha Brasil
-- Run this in your Supabase SQL editor

-- 1. Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'pix', 'crypto')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  is_monthly BOOLEAN DEFAULT FALSE,
  donation_tier TEXT CHECK (donation_tier IN ('apoiador_base', 'construtor', 'defensor', 'custom')),
  tier_name TEXT,
  donor_email TEXT,
  donor_name TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create donation stats table
CREATE TABLE IF NOT EXISTS donation_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  total_raised DECIMAL(10, 2) DEFAULT 0,
  total_donors INTEGER DEFAULT 0,
  total_monthly_recurring DECIMAL(10, 2) DEFAULT 0,
  total_one_time DECIMAL(10, 2) DEFAULT 0,
  active_monthly_subscribers INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'BRL',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Insert initial stats (starting with baseline from demo)
INSERT INTO donation_stats (total_raised, total_donors, currency) 
VALUES (867.00, 23, 'BRL') 
ON CONFLICT DO NOTHING;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_session ON donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_donations_payment_method ON donations(payment_method);

-- 5. Create function to update stats automatically
CREATE OR REPLACE FUNCTION update_donation_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stats when payment status changes to 'completed'
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    UPDATE donation_stats SET
      total_raised = total_raised + NEW.amount,
      total_donors = total_donors + 1,
      total_monthly_recurring = CASE 
        WHEN NEW.is_monthly THEN total_monthly_recurring + NEW.amount
        ELSE total_monthly_recurring
      END,
      total_one_time = CASE 
        WHEN NOT NEW.is_monthly THEN total_one_time + NEW.amount
        ELSE total_one_time
      END,
      active_monthly_subscribers = CASE 
        WHEN NEW.is_monthly THEN active_monthly_subscribers + 1
        ELSE active_monthly_subscribers
      END,
      last_updated = NOW()
    WHERE id = (SELECT id FROM donation_stats ORDER BY id LIMIT 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create the trigger
DROP TRIGGER IF EXISTS trigger_update_donation_stats ON donations;
CREATE TRIGGER trigger_update_donation_stats
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donation_stats();

-- 7. Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_stats ENABLE ROW LEVEL SECURITY;

-- 8. Create public read policy for donation stats
DROP POLICY IF EXISTS "Public can read donation stats" ON donation_stats;
CREATE POLICY "Public can read donation stats" ON donation_stats
  FOR SELECT USING (true);

-- 9. Create API policies for donations (needed for webhooks)
DROP POLICY IF EXISTS "API can insert donations" ON donations;
CREATE POLICY "API can insert donations" ON donations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "API can update donations" ON donations;
CREATE POLICY "API can update donations" ON donations
  FOR UPDATE USING (true);

-- 10. Create admin policy for full access to donations
DROP POLICY IF EXISTS "Admin full access to donations" ON donations;
CREATE POLICY "Admin full access to donations" ON donations
  FOR ALL USING (
    auth.jwt() ->> 'email' = 'cristiano@marchabrasil.com'
    OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 11. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON donation_stats TO anon;
GRANT SELECT ON donation_stats TO authenticated;
GRANT INSERT, UPDATE ON donations TO anon;  -- Needed for webhook processing
GRANT INSERT, UPDATE ON donations TO authenticated;

-- Test the setup
SELECT 'Database setup completed successfully!' as status;
SELECT * FROM donation_stats;