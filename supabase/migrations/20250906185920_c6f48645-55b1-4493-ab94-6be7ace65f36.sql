-- Insert Portfolio Analysis module into system_modules
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
  'portfolio-analysis',
  'Portfolio Analysis',
  '/portfolios/analysis',
  'BarChart3',
  'Portfolios',
  'Advanced portfolio analysis with performance metrics, risk assessment, and interactive charts',
  'standard_user',
  false,
  true,
  3
);