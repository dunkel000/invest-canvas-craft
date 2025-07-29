-- Enhanced admin functions for user management
CREATE OR REPLACE FUNCTION public.remove_role_from_user(_user_email text, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = _user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Remove the role
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = _role;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_role_to_user(_user_email text, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = _user_email;
  
  IF target_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Insert role (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_statistics(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  result jsonb := '{}';
  portfolio_count int;
  asset_count int;
  total_value numeric;
BEGIN
  -- Get portfolio count
  SELECT COUNT(*) INTO portfolio_count
  FROM public.portfolios
  WHERE user_id = _user_id;
  
  -- Get asset count
  SELECT COUNT(*) INTO asset_count
  FROM public.assets
  WHERE user_id = _user_id;
  
  -- Get total portfolio value
  SELECT COALESCE(SUM(total_value), 0) INTO total_value
  FROM public.portfolios
  WHERE user_id = _user_id;
  
  result := jsonb_build_object(
    'portfolio_count', portfolio_count,
    'asset_count', asset_count,
    'total_value', total_value
  );
  
  RETURN result;
END;
$$;

-- Create audit_logs table for tracking admin actions
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  target_user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Only admins can insert audit logs
CREATE POLICY "Admins can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(_action text, _target_user_id uuid DEFAULT NULL, _details jsonb DEFAULT '{}')
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.audit_logs (admin_user_id, target_user_id, action, details)
  VALUES (auth.uid(), _target_user_id, _action, _details)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;