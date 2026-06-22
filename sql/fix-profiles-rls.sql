-- Fix: Add INSERT policy to profiles table for user registration

-- Allow users to create their own profile during signup
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Alternative (more permissive): Allow service role to insert profiles (for signups)
-- This is needed if the above policy doesn't work
CREATE POLICY "Service role can insert profiles"
  ON profiles
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Verify the policy exists
SELECT * FROM pg_policies WHERE tablename = 'profiles';
