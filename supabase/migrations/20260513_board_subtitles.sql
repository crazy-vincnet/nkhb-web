-- Add board subtitle columns to pages table
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS board_subtitle_ko TEXT DEFAULT '뉴코리아 희망방송의 소중한 소식과 공식 업데이트를 전해드립니다.';
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS board_subtitle_en TEXT DEFAULT 'Delivering valuable news and official updates from NKHB.';
