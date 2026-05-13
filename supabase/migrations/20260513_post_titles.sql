-- Add title column to nkhb_posts table
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS title TEXT;

-- (Optional) If you want to ensure titles exist for existing posts
UPDATE public.nkhb_posts SET title = SUBSTRING(content FROM 1 FOR 50) WHERE title IS NULL;
