-- Add source field to assets table to distinguish between composed assets and API imports
ALTER TABLE public.assets 
ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';

-- Add comment to clarify the source field
COMMENT ON COLUMN public.assets.source IS 'Source of the asset: manual (composed), api (imported from external API), universe (from asset universe)';