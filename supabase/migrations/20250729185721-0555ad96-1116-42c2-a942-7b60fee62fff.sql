-- Fix RLS policies for admin to see all users
-- Update profiles table RLS to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Update user_roles table to allow better admin access
-- The existing policy should already work, but let's make sure