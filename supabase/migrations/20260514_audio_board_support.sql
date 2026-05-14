-- Update nkhb_posts to support audio board features
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'news';
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.nkhb_posts ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Index for filtering by post_type
CREATE INDEX IF NOT EXISTS idx_nkhb_posts_post_type ON public.nkhb_posts(post_type);
