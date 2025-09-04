-- Create enum types for quant lab
CREATE TYPE public.execution_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');
CREATE TYPE public.job_status AS ENUM ('active', 'paused', 'completed', 'failed');
CREATE TYPE public.artifact_type AS ENUM ('chart', 'data', 'report', 'image');

-- Create quant_notebooks table
CREATE TABLE public.quant_notebooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL DEFAULT '{"cells": []}',
  version INTEGER NOT NULL DEFAULT 1,
  is_public BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quant_runs table
CREATE TABLE public.quant_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notebook_id UUID REFERENCES public.quant_notebooks(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  status execution_status NOT NULL DEFAULT 'pending',
  stdout TEXT,
  stderr TEXT,
  execution_time_ms INTEGER,
  memory_usage_mb INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create quant_snippets table
CREATE TABLE public.quant_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  code TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT false,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quant_datasets table
CREATE TABLE public.quant_datasets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL, -- 'portfolio', 'external', 'upload'
  source_config JSONB NOT NULL DEFAULT '{}',
  schema_info JSONB DEFAULT '{}',
  row_count INTEGER,
  last_synced TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quant_jobs table
CREATE TABLE public.quant_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notebook_id UUID REFERENCES public.quant_notebooks(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cron_expression TEXT NOT NULL,
  parameters JSONB DEFAULT '{}',
  status job_status NOT NULL DEFAULT 'active',
  last_run_id UUID,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quant_artifacts table
CREATE TABLE public.quant_artifacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  run_id UUID REFERENCES public.quant_runs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  artifact_type artifact_type NOT NULL,
  file_path TEXT, -- path in storage bucket
  metadata JSONB DEFAULT '{}',
  size_bytes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for quant lab artifacts
INSERT INTO storage.buckets (id, name, public)
VALUES ('quant-artifacts', 'quant-artifacts', false);

-- Enable RLS on all tables
ALTER TABLE public.quant_notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quant_artifacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quant_notebooks
CREATE POLICY "Users can view their own notebooks" ON public.quant_notebooks
FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own notebooks" ON public.quant_notebooks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notebooks" ON public.quant_notebooks
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notebooks" ON public.quant_notebooks
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quant_runs
CREATE POLICY "Users can view their own runs" ON public.quant_runs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own runs" ON public.quant_runs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own runs" ON public.quant_runs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own runs" ON public.quant_runs
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quant_snippets
CREATE POLICY "Users can view snippets" ON public.quant_snippets
FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own snippets" ON public.quant_snippets
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own snippets" ON public.quant_snippets
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own snippets" ON public.quant_snippets
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quant_datasets
CREATE POLICY "Users can view their own datasets" ON public.quant_datasets
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own datasets" ON public.quant_datasets
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own datasets" ON public.quant_datasets
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own datasets" ON public.quant_datasets
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quant_jobs
CREATE POLICY "Users can view their own jobs" ON public.quant_jobs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs" ON public.quant_jobs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs" ON public.quant_jobs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs" ON public.quant_jobs
FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quant_artifacts
CREATE POLICY "Users can view their own artifacts" ON public.quant_artifacts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own artifacts" ON public.quant_artifacts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own artifacts" ON public.quant_artifacts
FOR DELETE USING (auth.uid() = user_id);

-- Storage policies for quant-artifacts bucket
CREATE POLICY "Users can view their own artifacts in storage" ON storage.objects
FOR SELECT USING (bucket_id = 'quant-artifacts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own artifacts" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'quant-artifacts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own artifacts in storage" ON storage.objects
FOR UPDATE USING (bucket_id = 'quant-artifacts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own artifacts in storage" ON storage.objects
FOR DELETE USING (bucket_id = 'quant-artifacts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for better performance
CREATE INDEX idx_quant_notebooks_user_id ON public.quant_notebooks(user_id);
CREATE INDEX idx_quant_notebooks_public ON public.quant_notebooks(is_public) WHERE is_public = true;
CREATE INDEX idx_quant_runs_user_id ON public.quant_runs(user_id);
CREATE INDEX idx_quant_runs_notebook_id ON public.quant_runs(notebook_id);
CREATE INDEX idx_quant_runs_status ON public.quant_runs(status);
CREATE INDEX idx_quant_snippets_user_id ON public.quant_snippets(user_id);
CREATE INDEX idx_quant_snippets_public ON public.quant_snippets(is_public) WHERE is_public = true;
CREATE INDEX idx_quant_datasets_user_id ON public.quant_datasets(user_id);
CREATE INDEX idx_quant_jobs_user_id ON public.quant_jobs(user_id);
CREATE INDEX idx_quant_jobs_next_run ON public.quant_jobs(next_run_at) WHERE status = 'active';
CREATE INDEX idx_quant_artifacts_user_id ON public.quant_artifacts(user_id);
CREATE INDEX idx_quant_artifacts_run_id ON public.quant_artifacts(run_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_quant_notebooks_updated_at
  BEFORE UPDATE ON public.quant_notebooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quant_snippets_updated_at
  BEFORE UPDATE ON public.quant_snippets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quant_datasets_updated_at
  BEFORE UPDATE ON public.quant_datasets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quant_jobs_updated_at
  BEFORE UPDATE ON public.quant_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add new system modules for quant lab
INSERT INTO public.system_modules (module_id, name, path, icon, category, description, min_role, sort_order)
VALUES 
  ('quant_notebooks', 'Notebooks', '/lab/notebooks', 'FileCode', 'quant', 'Python notebooks for quantitative analysis', 'premium_user', 60),
  ('quant_datasets', 'Datasets', '/lab/datasets', 'Database', 'quant', 'Data sources and portfolio connections', 'standard_user', 61),
  ('quant_snippets', 'Code Snippets', '/lab/snippets', 'Code', 'quant', 'Reusable analysis code library', 'standard_user', 62),
  ('quant_jobs', 'Scheduled Jobs', '/lab/jobs', 'Clock', 'quant', 'Automated analysis scheduling', 'premium_user', 63),
  ('quant_results', 'Results', '/lab/results', 'BarChart3', 'quant', 'Execution history and outputs', 'standard_user', 64);

-- Create function to get user portfolio data for Python analysis
CREATE OR REPLACE FUNCTION public.get_user_portfolio_data(_user_id UUID)
RETURNS TABLE(
  portfolio_id UUID,
  portfolio_name TEXT,
  asset_id UUID,
  asset_name TEXT,
  asset_symbol TEXT,
  asset_type TEXT,
  quantity NUMERIC,
  current_price NUMERIC,
  total_value NUMERIC,
  allocation_percentage NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id as portfolio_id,
    p.name as portfolio_name,
    a.id as asset_id,
    a.name as asset_name,
    a.symbol as asset_symbol,
    a.asset_type::text as asset_type,
    a.quantity,
    a.current_price,
    a.total_value,
    a.allocation_percentage
  FROM public.portfolios p
  LEFT JOIN public.assets a ON p.id = a.portfolio_id
  WHERE p.user_id = _user_id
  ORDER BY p.name, a.name;
$$;