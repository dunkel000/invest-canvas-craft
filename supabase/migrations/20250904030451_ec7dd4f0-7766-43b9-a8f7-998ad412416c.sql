-- Add Macro Compass module to system_modules
INSERT INTO public.system_modules (
  module_id,
  name,
  path,
  icon,
  category,
  description,
  min_role,
  requires_subscription,
  is_active,
  sort_order
) VALUES (
  'macro_compass',
  'Macro Compass',
  '/macro-compass',
  'TrendingUp',
  'tools',
  'Advanced quantitative macro indicator analysis and economic data visualization',
  'standard_user',
  false,
  true,
  3
);