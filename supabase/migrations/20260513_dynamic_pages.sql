-- Create pages table for dynamic sub-pages
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_ko TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ko TEXT,
    content_en TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Public can SELECT published pages
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view published pages') THEN
        CREATE POLICY "Public can view published pages" ON public.pages
            FOR SELECT USING (is_published = true);
    END IF;
END $$;

-- Admins have full access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to pages') THEN
        CREATE POLICY "Admins have full access to pages" ON public.pages
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
