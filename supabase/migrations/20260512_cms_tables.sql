-- Create cms_pages table for Visual CMS
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    layout_json JSONB,
    seo_title_ko TEXT,
    seo_title_en TEXT,
    seo_description_ko TEXT,
    seo_description_en TEXT,
    seo_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public: Can only SELECT
CREATE POLICY "Allow public read access" ON public.cms_pages
    FOR SELECT USING (true);

-- Authenticated Admin: Full CRUD
CREATE POLICY "Allow admin full access" ON public.cms_pages
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_cms_pages_updated_at
    BEFORE UPDATE ON public.cms_pages
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Comment on table
COMMENT ON TABLE public.cms_pages IS 'Stores GrapesJS layout and SEO metadata for dynamic pages.';
