-- Add board_type to pages to allow choosing between news and audio boards
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS board_type TEXT DEFAULT 'news';
