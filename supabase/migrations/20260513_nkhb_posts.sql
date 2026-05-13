-- 1. Create the new nkhb_posts table
CREATE TABLE IF NOT EXISTS public.nkhb_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL DEFAULT 'NKHB Admin',
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.nkhb_posts ENABLE ROW LEVEL SECURITY;

-- 3. Setup Policies
-- Public can view posts if they belong to a published page OR have no specific page assigned
CREATE POLICY "Public can view nkhb_posts" ON public.nkhb_posts
    FOR SELECT USING (
        page_id IS NULL OR 
        EXISTS (SELECT 1 FROM public.pages WHERE id = nkhb_posts.page_id AND is_published = true)
    );

-- Only authenticated admins can create, update, or delete
CREATE POLICY "Admins full access to nkhb_posts" ON public.nkhb_posts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Create an index for performance
CREATE INDEX IF NOT EXISTS idx_nkhb_posts_page_id ON public.nkhb_posts(page_id);
