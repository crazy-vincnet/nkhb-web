-- Add bilingual columns to nkhb_posts
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS title_ko TEXT;
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS title_en TEXT;
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS content_ko TEXT;
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS content_en TEXT;

-- Migrate existing data
UPDATE public.nkhb_posts 
SET 
    title_ko = COALESCE(title, ''),
    content_ko = COALESCE(content, '');

-- Optional: You might want to keep title and content for backward compatibility 
-- or drop them if you're sure. Let's keep them for now to avoid immediate breakage.
