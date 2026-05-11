-- NKHB Supabase Initial Schema
-- Created: 2026-05-06
-- Description: Migration script for letters, audio tracks, schedule, and dynamic content.

-- 1. Letters Table
-- Stores messages sent by users to North Korean people.
CREATE TABLE IF NOT EXISTS public.letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    email TEXT,
    reason TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Audio Tracks Table
-- Stores broadcast samples for the "Sample Listen" feature.
CREATE TABLE IF NOT EXISTS public.audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ko TEXT NOT NULL,
    title_en TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    duration TEXT,
    is_active BOOLEAN DEFAULT true,
    "order" INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Schedule Table
-- Stores the broadcast schedule and frequencies.
CREATE TABLE IF NOT EXISTS public.schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day TEXT NOT NULL,
    time TEXT NOT NULL,
    frequency TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(day, time)
);

-- 4. Content Table
-- Stores dynamic text content for the website that admins can update.
CREATE TABLE IF NOT EXISTS public.content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value_ko TEXT,
    value_en TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Letters
-- Public: Can only INSERT (to send a letter). 
-- Added security: Public cannot set status other than 'pending'.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert letters') THEN
        CREATE POLICY "Public can insert letters" ON public.letters
            FOR INSERT WITH CHECK (status = 'pending');
    END IF;
END $$;

-- Authenticated Admin: Full CRUD
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to letters') THEN
        CREATE POLICY "Admins have full access to letters" ON public.letters
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;


-- RLS Policies for Audio Tracks
-- Public: Can only SELECT (to listen to samples)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can select audio_tracks') THEN
        CREATE POLICY "Public can select audio_tracks" ON public.audio_tracks
            FOR SELECT USING (true);
    END IF;
END $$;

-- Authenticated Admin: Full CRUD
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to audio_tracks') THEN
        CREATE POLICY "Admins have full access to audio_tracks" ON public.audio_tracks
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;


-- RLS Policies for Schedule
-- Public: Can only SELECT
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can select schedule') THEN
        CREATE POLICY "Public can select schedule" ON public.schedule
            FOR SELECT USING (true);
    END IF;
END $$;

-- Authenticated Admin: Full CRUD
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to schedule') THEN
        CREATE POLICY "Admins have full access to schedule" ON public.schedule
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;


-- RLS Policies for Content
-- Public: Can only SELECT
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can select content') THEN
        CREATE POLICY "Public can select content" ON public.content
            FOR SELECT USING (true);
    END IF;
END $$;

-- Authenticated Admin: Full CRUD
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to content') THEN
        CREATE POLICY "Admins have full access to content" ON public.content
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Initial Seed Data

-- Seed data for audio_tracks
INSERT INTO public.audio_tracks (title_ko, title_en, url, "order") VALUES
('우리가 왜 방송을 시작하는가', 'Why We Started Broadcasting', 'https://pub-7ae274a6d9464c61bcc16d57b6f3dbef.r2.dev/우리가 왜 방송을 시작하는가.mp3', 1),
('희망의 편지', 'Letter of Hope', 'https://pub-7ae274a6d9464c61bcc16d57b6f3dbef.r2.dev/희망의 편지.mp3', 2),
('자유 시리즈 01_자유란 무엇입니까', 'Freedom Series 01: What is Freedom?', 'https://pub-7ae274a6d9464c61bcc16d57b6f3dbef.r2.dev/자유 시리즈 01_자유란 무엇입니까.mp3', 3),
('통일 이야기 01_우리는 원래 하나의 나라였습니다', 'Unification Story 01: We Were Originally One Nation', 'https://pub-7ae274a6d9464c61bcc16d57b6f3dbef.r2.dev/통일 이야기 01_우리는 원래 하나의 나라였습니다.mp3', 4),
('마음의 쉼표, 음악 한 곡', 'A Pause for the Heart, A Piece of Music', 'https://pub-7ae274a6d9464c61bcc16d57b6f3dbef.r2.dev/마음의 쉼표, 음악 한 곡.mp3', 5),
('국제뉴스', 'International News', 'https://pub-7ae274a6d9464c61bcc16d57b6f3dbef.r2.dev/국제뉴스.mp3', 6),
('조선 종합 날씨', 'North Korea Weather Forecast', 'https://pub-7ae274a6d9464c61bcc16d57b6f3dbef.r2.dev/조선 종합 날씨.mp3', 7)
ON CONFLICT (url) DO UPDATE SET
    title_ko = EXCLUDED.title_ko,
    title_en = EXCLUDED.title_en,
    "order" = EXCLUDED."order";

-- Seed data for schedule
INSERT INTO public.schedule (day, time, frequency) VALUES
('Mon · Wed · Fri', '02:30-03:00', '5920 kHz'),
('Tue · Thu · Sat', '23:00-23:30', '9470 kHz')
ON CONFLICT (day, time) DO UPDATE SET
    frequency = EXCLUDED.frequency;

-- Seed data for content
INSERT INTO public.content (key, value_ko, value_en) VALUES
('hero_title', '북한의 밤에</br>진실과 희망을 전합니다', 'In the Night of North Korea</br>We Bring Truth and Hope'),
('hero_subtitle', '“진리가 너희를 자유케 하리니”', '“The truth will set you free.”')
ON CONFLICT (key) DO UPDATE SET
    value_ko = EXCLUDED.value_ko,
    value_en = EXCLUDED.value_en;
