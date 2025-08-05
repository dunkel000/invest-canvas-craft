-- Drop the existing single-column constraint if it exists
ALTER TABLE public.asset_universe DROP CONSTRAINT IF EXISTS asset_universe_symbol_key;

-- Add a composite unique constraint on symbol and source
ALTER TABLE public.asset_universe 
ADD CONSTRAINT asset_universe_symbol_source_key UNIQUE (symbol, source);