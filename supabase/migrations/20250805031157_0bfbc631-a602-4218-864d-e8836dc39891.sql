-- Fix Custom Portfolios route path
UPDATE public.system_modules 
SET path = '/portfolios/custom'
WHERE module_id = 'personal_portfolio';

-- Also update Assets and Asset Composer paths to be more consistent
UPDATE public.system_modules 
SET path = '/portfolios/assets'
WHERE module_id = 'assets';

UPDATE public.system_modules 
SET path = '/portfolios/asset-composer'
WHERE module_id = 'asset_composer';