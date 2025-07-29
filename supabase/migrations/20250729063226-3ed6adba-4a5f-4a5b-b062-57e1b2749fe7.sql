-- Create asset universe table to store all available assets
CREATE TABLE public.asset_universe (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_type asset_type NOT NULL,
  current_price NUMERIC,
  market_cap NUMERIC,
  sector TEXT,
  industry TEXT,
  country TEXT,
  exchange TEXT,
  description TEXT,
  source TEXT NOT NULL DEFAULT 'manual', -- 'sp500', 'api', 'manual', 'composer'
  source_id TEXT, -- reference to external source
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on symbol for active assets
CREATE UNIQUE INDEX idx_asset_universe_symbol_active ON public.asset_universe (symbol) WHERE is_active = true;

-- Create indexes for performance
CREATE INDEX idx_asset_universe_type ON public.asset_universe (asset_type);
CREATE INDEX idx_asset_universe_source ON public.asset_universe (source);
CREATE INDEX idx_asset_universe_sector ON public.asset_universe (sector);

-- Enable RLS
ALTER TABLE public.asset_universe ENABLE ROW LEVEL SECURITY;

-- Create policies for asset universe (readable by all authenticated users, writable by owners)
CREATE POLICY "Asset universe is viewable by authenticated users" 
ON public.asset_universe 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert assets into universe" 
ON public.asset_universe 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own assets" 
ON public.asset_universe 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Add portfolio allocation tracking
ALTER TABLE public.assets ADD COLUMN allocation_percentage NUMERIC DEFAULT 0;
ALTER TABLE public.assets ADD COLUMN target_allocation_percentage NUMERIC DEFAULT 0;
ALTER TABLE public.assets ADD COLUMN universe_asset_id UUID REFERENCES public.asset_universe(id);

-- Create trigger for updated_at
CREATE TRIGGER update_asset_universe_updated_at
BEFORE UPDATE ON public.asset_universe
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create portfolio performance tracking table
CREATE TABLE public.portfolio_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_value NUMERIC NOT NULL DEFAULT 0,
  daily_return NUMERIC DEFAULT 0,
  daily_return_percentage NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for portfolio performance
ALTER TABLE public.portfolio_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolio performance
CREATE POLICY "Users can view their own portfolio performance" 
ON public.portfolio_performance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own portfolio performance" 
ON public.portfolio_performance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_portfolio_performance_portfolio_date ON public.portfolio_performance (portfolio_id, date);
CREATE INDEX idx_portfolio_performance_user_date ON public.portfolio_performance (user_id, date);