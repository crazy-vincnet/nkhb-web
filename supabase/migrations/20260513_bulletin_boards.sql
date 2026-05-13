-- Add has_board toggle to pages table
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS has_board BOOLEAN DEFAULT false;

-- Create posts table for bulletin boards
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true, -- Auto-approve for now, can be changed to false for moderation
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can SELECT posts from published pages
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view posts') THEN
        CREATE POLICY "Public can view posts" ON public.posts
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.pages 
                    WHERE id = posts.page_id AND is_published = true
                )
            );
    END IF;
END $$;

-- Public can INSERT posts (with basic validation)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can create posts') THEN
        CREATE POLICY "Public can create posts" ON public.posts
            FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Admins have full access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to posts') THEN
        CREATE POLICY "Admins have full access to posts" ON public.posts
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;
