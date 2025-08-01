-- Add role limits and configurations
ALTER TABLE public.user_roles 
ADD COLUMN max_portfolios INTEGER DEFAULT 5,
ADD COLUMN max_api_connections INTEGER DEFAULT 2,
ADD COLUMN max_requests_per_day INTEGER DEFAULT 1000,
ADD COLUMN features_enabled JSONB DEFAULT '{}',
ADD COLUMN subscription_tier TEXT DEFAULT 'basic';

-- Update default values based on role
UPDATE public.user_roles 
SET 
  max_portfolios = CASE 
    WHEN role = 'admin' THEN -1  -- unlimited
    WHEN role = 'investment_professional' THEN 50
    WHEN role = 'premium_user' THEN 20
    WHEN role = 'standard_user' THEN 5
    WHEN role = 'user' THEN 3
  END,
  max_api_connections = CASE 
    WHEN role = 'admin' THEN -1  -- unlimited
    WHEN role = 'investment_professional' THEN 10
    WHEN role = 'premium_user' THEN 5
    WHEN role = 'standard_user' THEN 2
    WHEN role = 'user' THEN 1
  END,
  max_requests_per_day = CASE 
    WHEN role = 'admin' THEN -1  -- unlimited
    WHEN role = 'investment_professional' THEN 10000
    WHEN role = 'premium_user' THEN 5000
    WHEN role = 'standard_user' THEN 1000
    WHEN role = 'user' THEN 500
  END,
  subscription_tier = CASE 
    WHEN role = 'admin' THEN 'enterprise'
    WHEN role = 'investment_professional' THEN 'professional'
    WHEN role = 'premium_user' THEN 'premium'
    WHEN role = 'standard_user' THEN 'standard'
    WHEN role = 'user' THEN 'basic'
  END;

-- Create function to get user role limits
CREATE OR REPLACE FUNCTION public.get_user_role_limits(_user_id uuid)
RETURNS TABLE(
  role app_role,
  max_portfolios integer,
  max_api_connections integer,
  max_requests_per_day integer,
  features_enabled jsonb,
  subscription_tier text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ur.role,
    ur.max_portfolios,
    ur.max_api_connections,
    ur.max_requests_per_day,
    ur.features_enabled,
    ur.subscription_tier
  FROM public.user_roles ur
  WHERE ur.user_id = _user_id
  ORDER BY 
    CASE ur.role 
      WHEN 'admin' THEN 4
      WHEN 'investment_professional' THEN 3
      WHEN 'premium_user' THEN 2
      WHEN 'standard_user' THEN 1
      WHEN 'user' THEN 1
      ELSE 0
    END DESC
  LIMIT 1;
END;
$$;

-- Create function to update role limits (admin only)
CREATE OR REPLACE FUNCTION public.update_role_limits(
  _role app_role,
  _max_portfolios integer,
  _max_api_connections integer,
  _max_requests_per_day integer,
  _features_enabled jsonb DEFAULT '{}',
  _subscription_tier text DEFAULT 'basic'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only admins can update role limits
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  
  UPDATE public.user_roles 
  SET 
    max_portfolios = _max_portfolios,
    max_api_connections = _max_api_connections,
    max_requests_per_day = _max_requests_per_day,
    features_enabled = _features_enabled,
    subscription_tier = _subscription_tier,
    updated_at = now()
  WHERE role = _role;
  
  RETURN true;
END;
$$;