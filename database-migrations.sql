-- Database schema for dashboard functionality
-- Run these in Supabase SQL Editor

-- 1. Saved Properties table (for buyers to save properties they're interested in)
CREATE TABLE IF NOT EXISTS saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- 2. Tours table (for scheduling property tours)
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id), -- Property admin who will conduct the tour
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Messages table (for buyer-seller communication)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Inquiries table (for property inquiries)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'closed')),
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User Sessions table (for tracking active users)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 6. Payments table (for revenue tracking)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Add admin_id to properties table if it doesn't exist
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES auth.users(id);

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_properties_property_id ON saved_properties(property_id);
CREATE INDEX IF NOT EXISTS idx_tours_user_id ON tours(user_id);
CREATE INDEX IF NOT EXISTS idx_tours_property_id ON tours(property_id);
CREATE INDEX IF NOT EXISTS idx_tours_admin_id ON tours(admin_id);
CREATE INDEX IF NOT EXISTS idx_tours_scheduled_date ON tours(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies

-- Saved Properties: Users can only see their own saved properties
CREATE POLICY "Users can view their own saved properties" ON saved_properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own saved properties" ON saved_properties
  FOR ALL USING (auth.uid() = user_id);

-- Tours: Users can see tours they're involved in, admins can see tours for their properties
CREATE POLICY "Users can view their own tours" ON tours
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = admin_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Users can create tours" ON tours
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tours" ON tours
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = admin_id);

-- Messages: Users can only see messages they sent or received
CREATE POLICY "Users can view their own messages" ON messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can mark messages as read" ON messages
  FOR UPDATE USING (auth.uid() = receiver_id);

-- Inquiries: Users can see inquiries they sent or for their properties
CREATE POLICY "Users can view their inquiries" ON inquiries
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = inquiries.property_id AND p.admin_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Users can create inquiries" ON inquiries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Sessions: Only system admins can view, users can manage their own
CREATE POLICY "Users can manage their own sessions" ON user_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Payments: Users can see their own payments, admins can see all
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 11. Create some sample data for testing (optional)
-- Uncomment these lines to create sample data for testing

-- INSERT INTO saved_properties (user_id, property_id) 
-- SELECT 
--   (SELECT id FROM auth.users LIMIT 1),
--   (SELECT id FROM properties LIMIT 1)
-- WHERE NOT EXISTS (
--   SELECT 1 FROM saved_properties 
--   WHERE user_id = (SELECT id FROM auth.users LIMIT 1)
--   AND property_id = (SELECT id FROM properties LIMIT 1)
-- );

-- INSERT INTO tours (user_id, property_id, scheduled_date, status)
-- SELECT 
--   (SELECT id FROM auth.users LIMIT 1),
--   (SELECT id FROM properties LIMIT 1),
--   NOW() + INTERVAL '1 day',
--   'scheduled'
-- WHERE NOT EXISTS (
--   SELECT 1 FROM tours 
--   WHERE user_id = (SELECT id FROM auth.users LIMIT 1)
--   AND property_id = (SELECT id FROM properties LIMIT 1)
-- );

-- 12. Update existing properties to have admin_id (optional)
-- UPDATE properties 
-- SET admin_id = (
--   SELECT id FROM profiles 
--   WHERE role = 'staff' 
--   ORDER BY created_at 
--   LIMIT 1
-- )
-- WHERE admin_id IS NULL;

SELECT 'Database schema created successfully!' as result;
