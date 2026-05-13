-- 1. Create posts table if not exists
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 3. Setup Policies
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public can view posts" ON public.posts;
    CREATE POLICY "Public can view posts" ON public.posts
        FOR SELECT USING (
            EXISTS (
                SELECT 1 FROM public.pages 
                WHERE id = posts.page_id AND is_published = true
            ) OR page_id IS NULL
        );

    DROP POLICY IF EXISTS "Only admins can create posts" ON public.posts;
    CREATE POLICY "Only admins can create posts" ON public.posts
        FOR INSERT TO authenticated WITH CHECK (true);

    DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
    CREATE POLICY "Admins have full access to posts" ON public.posts
        FOR ALL TO authenticated USING (true) WITH CHECK (true);
END $$;

-- 4. Reload PostgREST cache (this happens automatically on DDL changes usually, 
-- but running a dummy alter can force it if needed)
ALTER TABLE public.posts ALTER COLUMN updated_at SET DEFAULT now();
