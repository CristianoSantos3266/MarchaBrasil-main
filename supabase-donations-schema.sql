-- Create donations table to track all donation records
CREATE TABLE IF NOT EXISTS donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE, -- Stripe checkout session ID
  stripe_payment_intent_id TEXT, -- Stripe payment intent ID
  amount DECIMAL(10, 2) NOT NULL, -- Amount in BRL
  currency TEXT DEFAULT 'BRL',
  payment_method TEXT NOT NULL, -- 'stripe', 'pix', 'crypto'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  is_monthly BOOLEAN DEFAULT FALSE, -- Monthly subscription vs one-time
  donation_tier TEXT, -- 'apoiador_base', 'construtor', 'defensor', 'custom'
  tier_name TEXT, -- Display name of tier
  donor_email TEXT, -- Optional donor email from Stripe
  donor_name TEXT, -- Optional donor name from Stripe
  stripe_customer_id TEXT, -- Stripe customer ID for subscriptions
  stripe_subscription_id TEXT, -- Stripe subscription ID if monthly
  metadata JSONB, -- Additional metadata from Stripe
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE, -- When payment was completed
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donation_stats table to track aggregated statistics
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

-- Insert initial stats record
INSERT INTO donation_stats (total_raised, total_donors) 
VALUES (867, 23) 
ON CONFLICT DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_stripe_session ON donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_donations_payment_method ON donations(payment_method);

-- Create trigger to update donation_stats when donations are completed
CREATE OR REPLACE FUNCTION update_donation_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stats when payment status changes to 'completed'
  IF NEW.payment_status = 'completed' AND OLD.payment_status != 'completed' THEN
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
    WHERE id = (SELECT id FROM donation_stats LIMIT 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_donation_stats ON donations;
CREATE TRIGGER trigger_update_donation_stats
  AFTER UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donation_stats();

-- Enable Row Level Security (RLS)
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to stats
CREATE POLICY "Public can read donation stats" ON donation_stats
  FOR SELECT USING (true);

-- Create policies for donations (admin only for full access, public for limited read)
CREATE POLICY "Admin full access to donations" ON donations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Allow API to insert donations (for webhook processing)
CREATE POLICY "API can insert donations" ON donations
  FOR INSERT WITH CHECK (true);

-- Allow API to update donations (for webhook processing)  
CREATE POLICY "API can update donations" ON donations
  FOR UPDATE USING (true);