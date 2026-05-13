-- Add layout columns to pages table for GrapesJS
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS layout_ko JSONB;
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS layout_en JSONB;

-- Ensure content columns can handle large HTML
ALTER TABLE public.pages ALTER COLUMN content_ko TYPE TEXT;
ALTER TABLE public.pages ALTER COLUMN content_en TYPE TEXT;
