-- Add "All Portfolios" module as the first portfolio module
INSERT INTO public.system_modules (module_id, name, path, icon, category, description, sort_order, min_role, is_active)
VALUES (
  'all_portfolios',
  'All Portfolios', 
  '/portfolios/all',
  'FolderOpen',
  'portfolios',
  'Unified view of all your investment portfolios and holdings',
  29,
  'standard_user',
  true
)
ON CONFLICT (module_id) DO UPDATE SET
  name = EXCLUDED.name,
  path = EXCLUDED.path,
  sort_order = EXCLUDED.sort_order;