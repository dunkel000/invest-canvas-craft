-- Update "Manual Portfolios" to "Investment Templates"
UPDATE public.system_modules 
SET 
  name = 'Investment Templates',
  path = '/portfolios/investment-templates',
  description = 'Alternative assets: Pokémon cards, Real Estate, Collectibles, and more',
  sort_order = 31
WHERE module_id = 'manual_portfolios';

-- Update "Personal Portfolio" to "Custom Portfolios"
UPDATE public.system_modules 
SET 
  name = 'Custom Portfolios',
  sort_order = 30
WHERE module_id = 'personal_portfolio';

-- Move "Assets" from tools to portfolios category
UPDATE public.system_modules 
SET 
  category = 'portfolios',
  sort_order = 34
WHERE module_id = 'assets';

-- Add "Asset Composer" module if it doesn't exist
INSERT INTO public.system_modules (module_id, name, path, icon, category, description, sort_order, min_role, is_active)
VALUES (
  'asset_composer',
  'Asset Composer', 
  '/asset-composer',
  'Wrench',
  'portfolios',
  'Design and analyze your asset compositions with cashflows and risk assessments',
  35,
  'standard_user',
  true
)
ON CONFLICT (module_id) DO UPDATE SET
  category = EXCLUDED.category,
  sort_order = EXCLUDED.sort_order;

-- Update API Synced Portfolios sort order
UPDATE public.system_modules 
SET sort_order = 32
WHERE module_id = 'api_synced_portfolios';

-- Update Client Portfolios sort order  
UPDATE public.system_modules 
SET sort_order = 33
WHERE module_id = 'client_portfolios';