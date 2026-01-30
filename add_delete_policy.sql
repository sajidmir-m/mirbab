-- ============================================
-- ADD MISSING DELETE POLICY FOR INQUIRIES
-- ============================================
-- Run this in Supabase SQL Editor to fix delete functionality

-- Check if delete policy exists
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'inquiries' AND policyname = 'Admins can delete inquiries';

-- If it doesn't exist, create it:
CREATE POLICY "Admins can delete inquiries" 
ON inquiries FOR DELETE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Verify all policies exist
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'inquiries'
ORDER BY policyname;

-- Expected policies:
-- 1. "Anyone can submit inquiry" (INSERT)
-- 2. "Admins can view inquiries" (SELECT)
-- 3. "Admins can update inquiries" (UPDATE)
-- 4. "Admins can delete inquiries" (DELETE) ← This was missing!


