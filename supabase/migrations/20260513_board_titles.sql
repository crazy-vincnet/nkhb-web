-- Add board title columns to pages table
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS board_title_ko TEXT DEFAULT '공지 및 소식';
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS board_title_en TEXT DEFAULT 'Board & Updates';
