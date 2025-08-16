-- Drop the restrictive view policy
DROP POLICY "Users can view their own profile" ON public.profiles;

-- Create a new policy that allows users to view all profiles
-- This is necessary for skill swapping functionality
CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);

-- Keep the other policies unchanged to maintain security
-- Users can still only create, update, and delete their own profiles