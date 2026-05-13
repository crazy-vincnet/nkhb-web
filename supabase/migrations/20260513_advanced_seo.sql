-- 1. Create a specialized site_settings table for global config
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value_ko TEXT,
    value_en TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add advanced columns to seo_settings
ALTER TABLE public.seo_settings ADD COLUMN IF NOT EXISTS meta_robots TEXT DEFAULT 'index, follow';
ALTER TABLE public.seo_settings ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE public.seo_settings ADD COLUMN IF NOT EXISTS twitter_card TEXT DEFAULT 'summary_large_image';

-- 3. Setup RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can select site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins full access to site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Initial Global SEO settings
INSERT INTO public.site_settings (key, value_ko, value_en)
VALUES 
('site_name', '뉴코리아 희망방송 (NKHB)', 'New Korea Hope Broadcasting (NKHB)'),
('default_og_image', 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png', 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png')
ON CONFLICT (key) DO NOTHING;
