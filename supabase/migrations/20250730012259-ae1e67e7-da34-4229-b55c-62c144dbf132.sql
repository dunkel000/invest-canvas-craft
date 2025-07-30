-- Function to get user accessible modules
CREATE OR REPLACE FUNCTION public.get_user_accessible_modules(_user_id uuid)
RETURNS TABLE(
  module_id text,
  name text,
  path text,
  icon text,
  category text,
  description text,
  sort_order integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Get user's highest role
  SELECT ur.role INTO user_role
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
  
  -- If no role found, default to standard_user
  IF user_role IS NULL THEN
    user_role := 'standard_user';
  END IF;
  
  -- Return accessible modules based on role and permissions
  RETURN QUERY
  SELECT 
    sm.module_id,
    sm.name,
    sm.path,
    sm.icon,
    sm.category,
    sm.description,
    sm.sort_order
  FROM public.system_modules sm
  LEFT JOIN public.role_module_permissions rmp 
    ON sm.module_id = rmp.module_id AND rmp.role = user_role
  WHERE 
    sm.is_active = true
    AND (
      -- Module is enabled for this role explicitly
      (rmp.is_enabled = true)
      OR 
      -- No explicit permission set, use default role hierarchy
      (rmp.id IS NULL AND (
        (user_role = 'admin') OR
        (user_role = 'investment_professional' AND sm.min_role IN ('standard_user', 'premium_user', 'investment_professional', 'user')) OR
        (user_role = 'premium_user' AND sm.min_role IN ('standard_user', 'premium_user', 'user')) OR
        (user_role IN ('standard_user', 'user') AND sm.min_role IN ('standard_user', 'user'))
      ))
    )
  ORDER BY sm.sort_order, sm.name;
END;
$$;

-- Function to check specific module permission
CREATE OR REPLACE FUNCTION public.check_module_permission(_user_id uuid, _module_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  has_access boolean := false;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.get_user_accessible_modules(_user_id)
    WHERE module_id = _module_id
  ) INTO has_access;
  
  RETURN has_access;
END;
$$;

-- Function to update role module permissions
CREATE OR REPLACE FUNCTION public.update_role_module_permission(_role app_role, _module_id text, _enabled boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- Only admins can update permissions
  IF NOT has_role(auth.uid(), 'admin') THEN
    RETURN false;
  END IF;
  
  INSERT INTO public.role_module_permissions (role, module_id, is_enabled)
  VALUES (_role, _module_id, _enabled)
  ON CONFLICT (role, module_id)
  DO UPDATE SET is_enabled = _enabled, updated_at = now();
  
  RETURN true;
END;
$$;