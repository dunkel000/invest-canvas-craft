-- Add unique constraint for symbol to enable ON CONFLICT functionality
ALTER TABLE public.asset_universe 
ADD CONSTRAINT asset_universe_symbol_key UNIQUE (symbol);