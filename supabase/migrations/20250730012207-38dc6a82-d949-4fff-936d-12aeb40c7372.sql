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