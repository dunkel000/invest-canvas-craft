-- Add risk categories enum
CREATE TYPE public.risk_category AS ENUM ('low', 'medium', 'high', 'very_high');

-- Add cashflow types enum  
CREATE TYPE public.cashflow_type AS ENUM ('income', 'expense', 'dividend', 'interest', 'capital_gain', 'capital_loss');

-- Add math function types enum
CREATE TYPE public.math_function_type AS ENUM ('add', 'subtract', 'multiply', 'divide', 'percentage', 'compound', 'present_value', 'future_value');

-- Add risk_category to assets table
ALTER TABLE public.assets ADD COLUMN risk_category public.risk_category DEFAULT 'medium';

-- Add metadata column for additional asset properties
ALTER TABLE public.assets ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;

-- Add API source tracking
ALTER TABLE public.assets ADD COLUMN api_connection_id uuid REFERENCES public.api_connections(id);

-- Create cashflows table for cashflow nodes
CREATE TABLE public.cashflows (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  asset_id uuid REFERENCES public.assets(id) ON DELETE CASCADE,
  flow_id uuid REFERENCES public.flows(id) ON DELETE CASCADE,
  cashflow_type public.cashflow_type NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  frequency text DEFAULT 'monthly', -- monthly, quarterly, yearly, one-time
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on cashflows
ALTER TABLE public.cashflows ENABLE ROW LEVEL SECURITY;

-- Create policies for cashflows
CREATE POLICY "Users can view their own cashflows" 
ON public.cashflows 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cashflows" 
ON public.cashflows 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cashflows" 
ON public.cashflows 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cashflows" 
ON public.cashflows 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for cashflows timestamps
CREATE TRIGGER update_cashflows_updated_at
BEFORE UPDATE ON public.cashflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create math_functions table for math function nodes
CREATE TABLE public.math_functions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  flow_id uuid REFERENCES public.flows(id) ON DELETE CASCADE,
  function_type public.math_function_type NOT NULL,
  input_assets uuid[] DEFAULT '{}', -- Array of asset IDs as inputs
  parameters jsonb DEFAULT '{}'::jsonb, -- Function-specific parameters
  formula text, -- Custom formula if applicable
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on math_functions
ALTER TABLE public.math_functions ENABLE ROW LEVEL SECURITY;

-- Create policies for math_functions
CREATE POLICY "Users can view their own math functions" 
ON public.math_functions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own math functions" 
ON public.math_functions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own math functions" 
ON public.math_functions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own math functions" 
ON public.math_functions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for math_functions timestamps
CREATE TRIGGER update_math_functions_updated_at
BEFORE UPDATE ON public.math_functions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();