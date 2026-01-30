-- ============================================
-- FIX INQUIRIES RLS POLICIES & ADMIN SETUP
-- ============================================
-- Run this in your Supabase SQL Editor to fix inquiry issues

-- Step 1: Check if your admin user exists and has admin role
-- Replace 'your-admin-email@example.com' with your actual admin email
SELECT 
  u.id,
  u.email,
  p.role,
  p.id as profile_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE u.email = 'your-admin-email@example.com';

-- Step 2: If admin user doesn't have admin role, update it
-- Replace 'your-admin-email@example.com' with your actual admin email
UPDATE profiles 
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
);

-- If profile doesn't exist, create it:
INSERT INTO profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'your-admin-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Step 3: Drop and recreate RLS policies for inquiries (to ensure they're correct)
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON inquiries;
DROP POLICY IF EXISTS "Admins can view inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admins can delete inquiries" ON inquiries;

-- Recreate policies
CREATE POLICY "Anyone can submit inquiry" 
ON inquiries FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view inquiries" 
ON inquiries FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

CREATE POLICY "Admins can update inquiries" 
ON inquiries FOR UPDATE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- IMPORTANT: This policy was missing! Add it now:
CREATE POLICY "Admins can delete inquiries" 
ON inquiries FOR DELETE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Step 4: Verify the policies are correct
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'inquiries'
ORDER BY policyname;

-- Step 5: Test query (should return all inquiries if you're logged in as admin)
-- This will help verify the RLS is working
SELECT COUNT(*) as total_inquiries FROM inquiries;

-- ============================================
-- MANUAL SYNC: If you have inquiries in LocalStorage
-- ============================================
-- You can manually insert them using this template:
-- (Replace the values with actual data from LocalStorage)

/*
INSERT INTO inquiries (name, email, phone, message, package_id, status, created_at)
VALUES 
  ('John Doe', 'john@example.com', '+91 9876543210', 'I want to book a package', NULL, 'pending', NOW()),
  ('Jane Smith', 'jane@example.com', '+91 9876543211', 'Interested in Kashmir tour', NULL, 'pending', NOW());
*/

