-- Move "All Portfolios" from wealth to portfolios category
UPDATE public.system_modules 
SET 
  category = 'portfolios',
  sort_order = 29
WHERE module_id = 'all_portfolios';

-- Update "Asset Composer" icon to use nodes icon
UPDATE public.system_modules 
SET icon = 'Workflow'
WHERE module_id = 'asset_composer';

-- Move "Discover" to main category below Dashboard
UPDATE public.system_modules 
SET 
  category = 'main',
  sort_order = 11
WHERE module_id = 'discover';

-- Remove or hide the old "Flow Designer" since it's been replaced by "Asset Composer"
UPDATE public.system_modules 
SET is_active = false
WHERE module_id = 'flow_designer';