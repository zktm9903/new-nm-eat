-- Add liked column to menus table
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS liked INTEGER NOT NULL DEFAULT 0;

-- Create index on liked for faster queries
CREATE INDEX IF NOT EXISTS idx_menus_liked ON public.menus(liked);

