ALTER TABLE public.content ADD COLUMN IF NOT EXISTS style_props JSONB DEFAULT '{}'::jsonb;
