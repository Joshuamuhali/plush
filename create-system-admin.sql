-- Manual System Admin Creation
-- Run this in Supabase SQL Editor

-- Step 1: Create the auth user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) 
SELECT 
  gen_random_uuid() as id,
  'admin@plush.com' as email,
  crypt('Admin123!', gen_salt('bf')) as encrypted_password,
  NOW() as email_confirmed_at,
  NOW() as created_at,
  NOW() as updated_at,
  '{"full_name":"System Admin","role":"admin"}'::jsonb as raw_user_meta_data;

-- Step 2: Get the user ID from the result above
-- Then create the profile (replace USER_ID with the actual ID from step 1)

INSERT INTO profiles (
  id,
  full_name,
  role,
  seller_verification_status,
  is_active,
  created_at,
  updated_at
) VALUES (
  'USER_ID_FROM_STEP_1', -- Replace with actual user ID
  'System Admin',
  'admin',
  'approved',
  true,
  NOW(),
  NOW()
);

-- Alternative: Create both in one query (if you know the email)
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Create auth user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data
  ) 
  SELECT 
    gen_random_uuid(),
    'admin@plush.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"full_name":"System Admin","role":"admin"}'::jsonb
  RETURNING id INTO user_id;
  
  -- Create profile
  INSERT INTO profiles (
    id,
    full_name,
    role,
    seller_verification_status,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    user_id,
    'System Admin',
    'admin',
    'approved',
    true,
    NOW(),
    NOW()
  );
END $$;
