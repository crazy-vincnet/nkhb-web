-- Create seo_settings table
CREATE TABLE IF NOT EXISTS public.seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug TEXT UNIQUE NOT NULL,
    title_ko TEXT,
    title_en TEXT,
    description_ko TEXT,
    description_en TEXT,
    keywords_ko TEXT,
    keywords_en TEXT,
    og_image_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Public can SELECT
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can select seo_settings') THEN
        CREATE POLICY "Public can select seo_settings" ON public.seo_settings
            FOR SELECT USING (true);
    END IF;
END $$;

-- Admins have full access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to seo_settings') THEN
        CREATE POLICY "Admins have full access to seo_settings" ON public.seo_settings
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Initial data
INSERT INTO public.seo_settings (page_slug, title_ko, title_en, description_ko, description_en)
VALUES 
('home', '뉴코리아 희망방송 (NKHB)', 'New Korea Hope Broadcasting (NKHB)', '라디오 전파를 통해 북한 주민들에게 희망과 진실을 전합니다.', 'Delivering hope and truth to North Korean people through radio waves.'),
('about', 'NKFI 소개 | 뉴코리아 희망방송', 'About NKFI | NKHB', '뉴코리아 파운데이션 인터내셔널(NKFI) 사역 소개입니다.', 'Learn about New Korea Foundation International (NKFI) ministries.')
ON CONFLICT (page_slug) DO NOTHING;
