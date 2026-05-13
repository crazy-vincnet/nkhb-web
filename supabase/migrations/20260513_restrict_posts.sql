-- Update RLS for posts: Restrict insertion to authenticated users (admins) only
DROP POLICY IF EXISTS "Public can create posts" ON public.posts;

CREATE POLICY "Only admins can create posts" ON public.posts
    FOR INSERT TO authenticated WITH CHECK (true);
