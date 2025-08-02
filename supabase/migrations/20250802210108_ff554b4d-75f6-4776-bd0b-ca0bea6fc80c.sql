-- Fix the get_user_accessible_modules function to correctly filter by role hierarchy
CREATE OR REPLACE FUNCTION public.get_user_accessible_modules(_user_id uuid)
 RETURNS TABLE(module_id text, name text, path text, icon text, category text, description text, sort_order integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  user_role public.app_role;
  effective_role public.app_role;
BEGIN
  -- Get user's highest role
  SELECT ur.role INTO user_role
  FROM public.user_roles ur
  WHERE ur.user_id = _user_id
  ORDER BY 
    CASE ur.role 
      WHEN 'admin' THEN 5
      WHEN 'investment_professional' THEN 4
      WHEN 'premium_user' THEN 3
      WHEN 'standard_user' THEN 2
      WHEN 'user' THEN 2  -- Map 'user' to same level as 'standard_user'
      WHEN 'manager' THEN 1
      ELSE 0
    END DESC
  LIMIT 1;
  
  -- If no role found, default to standard_user
  IF user_role IS NULL THEN
    effective_role := 'standard_user';
  -- Map 'user' role to 'standard_user' for module access
  ELSIF user_role = 'user' THEN
    effective_role := 'standard_user';
  ELSE
    effective_role := user_role;
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
    ON sm.module_id = rmp.module_id AND rmp.role = effective_role
  WHERE 
    sm.is_active = true
    AND (
      -- Module is enabled for this role explicitly
      (rmp.is_enabled = true)
      OR 
      -- No explicit permission set, use default role hierarchy
      (rmp.id IS NULL AND (
        (effective_role = 'admin') OR
        (effective_role = 'investment_professional' AND sm.min_role IN ('standard_user', 'premium_user', 'investment_professional', 'user')) OR
        (effective_role = 'premium_user' AND sm.min_role IN ('standard_user', 'premium_user', 'user')) OR
        (effective_role = 'standard_user' AND sm.min_role IN ('standard_user', 'user'))
      ))
    )
  ORDER BY sm.sort_order, sm.name;
END;
$function$;