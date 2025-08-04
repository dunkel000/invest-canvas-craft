-- Extend the existing app_role enum to include all user tiers
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'investment_professional';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'premium_user';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'standard_user';

-- Create system_modules table to define all available modules
CREATE TABLE public.system_modules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id text NOT NULL UNIQUE,
  name text NOT NULL,
  path text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  description text,
  min_role app_role NOT NULL DEFAULT 'standard_user',
  requires_subscription boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create role_module_permissions table for granular access control
CREATE TABLE public.role_module_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role app_role NOT NULL,
  module_id text NOT NULL,
  is_enabled boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(role, module_id)
);

-- Create module_settings table for system-wide module configurations
CREATE TABLE public.module_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL DEFAULT '{}',
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_module_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for system_modules
CREATE POLICY "Authenticated users can view system modules"
ON public.system_modules FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can modify system modules"
ON public.system_modules FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for role_module_permissions
CREATE POLICY "Authenticated users can view role permissions"
ON public.role_module_permissions FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can modify role permissions"
ON public.role_module_permissions FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS policies for module_settings
CREATE POLICY "Authenticated users can view module settings"
ON public.module_settings FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can modify module settings"
ON public.module_settings FOR ALL
USING (has_role(auth.uid(), 'admin'));

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
        (user_role = 'investment_professional' AND sm.min_role IN ('standard_user', 'premium_user', 'investment_professional')) OR
        (user_role = 'premium_user' AND sm.min_role IN ('standard_user', 'premium_user')) OR
        (user_role = 'standard_user' AND sm.min_role = 'standard_user')
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

-- Insert default system modules
INSERT INTO public.system_modules (module_id, name, path, icon, category, description, min_role, sort_order) VALUES
-- Admin modules
('admin_dashboard', 'Admin Dashboard', '/admin', 'Crown', 'admin', 'Administrative overview and controls', 'admin', 1),
('user_management', 'User Management', '/admin/users', 'Users', 'admin', 'Manage users and roles', 'admin', 2),
('system_settings', 'System Settings', '/admin/settings', 'Settings', 'admin', 'Configure system-wide settings', 'admin', 3),
('audit_logs', 'Audit Logs', '/admin/audit-logs', 'FileText', 'admin', 'View system audit logs', 'admin', 4),
('system_analytics', 'System Analytics', '/admin/analytics', 'BarChart3', 'admin', 'System performance analytics', 'admin', 5),

-- Main dashboard
('dashboard', 'Dashboard', '/', 'LayoutDashboard', 'main', 'Main dashboard overview', 'standard_user', 10),

-- Wealth management modules
('all_portfolios', 'All Portfolios', '/wealth/all-portfolios', 'Briefcase', 'wealth', 'View all portfolio summaries', 'standard_user', 20),
('financial_goals', 'Financial Goals', '/wealth/financial-goals', 'Target', 'wealth', 'Set and track financial goals', 'standard_user', 21),
('liquidity_planning', 'Liquidity Planning', '/wealth/liquidity-planning', 'Droplets', 'wealth', 'Plan cash flow and liquidity', 'premium_user', 22),
('tax_planning', 'Tax Planning', '/wealth/tax-planning', 'Calculator', 'wealth', 'Tax optimization strategies', 'premium_user', 23),

-- Portfolio modules
('personal_portfolio', 'Personal Portfolio', '/portfolios/personal', 'User', 'portfolios', 'Manage personal investments', 'standard_user', 30),
('investment_templates', 'Investment Templates', '/portfolios/investment-templates', 'Edit', 'portfolios', 'Manually managed portfolios', 'standard_user', 31),
('api_synced_portfolios', 'API Synced Portfolios', '/portfolios/api-synced', 'RefreshCw', 'portfolios', 'Automatically synced portfolios', 'premium_user', 32),
('client_portfolios', 'Client Portfolios', '/portfolios/clients', 'Briefcase', 'portfolios', 'Manage client portfolios', 'investment_professional', 33),

-- Tools modules
('assets', 'Assets', '/assets', 'Coins', 'tools', 'Asset management and universe', 'standard_user', 40),
 ('asset_composer', 'Asset Composer', '/asset-composer', 'Workflow', 'tools', 'Design financial workflows', 'premium_user', 41),
('api_connections', 'API Connections', '/api-connections', 'Plug', 'tools', 'Manage external API connections', 'premium_user', 42),
('discover', 'Discover', '/discover', 'Search', 'tools', 'Discover new assets and opportunities', 'standard_user', 43),

-- Settings
('settings', 'Settings', '/settings', 'Settings', 'settings', 'User account settings', 'standard_user', 50);

-- Add triggers for updated_at
CREATE TRIGGER update_system_modules_updated_at
  BEFORE UPDATE ON public.system_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_role_module_permissions_updated_at
  BEFORE UPDATE ON public.role_module_permissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_module_settings_updated_at
  BEFORE UPDATE ON public.module_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();