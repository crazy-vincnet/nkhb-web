-- Restrict "admin" policies to an explicit allowlist.
--
-- Previously every admin policy was `TO authenticated USING (true)`, so any
-- account that could sign up (Supabase allows sign-ups by default) had full
-- read/write access, including the letters table (names, emails, locations).
--
-- After running this, manage admins with the SQL editor:
--   INSERT INTO public.admins (user_id) SELECT id FROM auth.users WHERE email = 'someone@example.com';
--   DELETE FROM public.admins WHERE user_id = '...';

-- 1. Allowlist table. RLS on with no policies: only service role / SQL editor can touch it.
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Seed with the accounts that exist today so current admins aren't locked out.
-- REVIEW THIS LIST afterwards (SELECT a.user_id, u.email FROM public.admins a JOIN auth.users u ON u.id = a.user_id;)
-- and delete anything you don't recognise.
INSERT INTO public.admins (user_id)
SELECT id FROM auth.users
ON CONFLICT DO NOTHING;

-- 2. Helper used by policies and by /api/translate (via rpc).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 3. Replace table policies.
DROP POLICY IF EXISTS "Admins have full access to letters" ON public.letters;
CREATE POLICY "Admins have full access to letters" ON public.letters
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to audio_tracks" ON public.audio_tracks;
CREATE POLICY "Admins have full access to audio_tracks" ON public.audio_tracks
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to schedule" ON public.schedule;
CREATE POLICY "Admins have full access to schedule" ON public.schedule
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to content" ON public.content;
CREATE POLICY "Admins have full access to content" ON public.content
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to sites_settings" ON public.sites_settings;
CREATE POLICY "Admins full access to sites_settings" ON public.sites_settings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admins can create posts" ON public.posts;
DROP POLICY IF EXISTS "Admins have full access to posts" ON public.posts;
CREATE POLICY "Admins have full access to posts" ON public.posts
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to pages" ON public.pages;
CREATE POLICY "Admins have full access to pages" ON public.pages
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to menu_items" ON public.menu_items;
CREATE POLICY "Admins have full access to menu_items" ON public.menu_items
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins full access to nkhb_posts" ON public.nkhb_posts;
CREATE POLICY "Admins full access to nkhb_posts" ON public.nkhb_posts
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins have full access to seo_settings" ON public.seo_settings;
CREATE POLICY "Admins have full access to seo_settings" ON public.seo_settings
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. Replace storage policies.
DROP POLICY IF EXISTS "Allow admins to upload assets" ON storage.objects;
CREATE POLICY "Allow admins to upload assets" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'assets' AND (storage.foldername(name))[1] = 'cms' AND public.is_admin());
DROP POLICY IF EXISTS "Allow admins to update assets" ON storage.objects;
CREATE POLICY "Allow admins to update assets" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'assets' AND (storage.foldername(name))[1] = 'cms' AND public.is_admin());
DROP POLICY IF EXISTS "Allow admins to delete assets" ON storage.objects;
CREATE POLICY "Allow admins to delete assets" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'assets' AND (storage.foldername(name))[1] = 'cms' AND public.is_admin());

DROP POLICY IF EXISTS "Allow admins to upload audio" ON storage.objects;
CREATE POLICY "Allow admins to upload audio" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'audio' AND public.is_admin());
DROP POLICY IF EXISTS "Allow admins to update audio" ON storage.objects;
CREATE POLICY "Allow admins to update audio" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'audio' AND public.is_admin());
DROP POLICY IF EXISTS "Allow admins to delete audio" ON storage.objects;
CREATE POLICY "Allow admins to delete audio" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'audio' AND public.is_admin());

-- 5. Cap public letter submissions (NOT VALID: existing rows aren't re-checked).
ALTER TABLE public.letters DROP CONSTRAINT IF EXISTS letters_length_check;
ALTER TABLE public.letters ADD CONSTRAINT letters_length_check CHECK (
    length(name) <= 100
    AND coalesce(length(email), 0) <= 320
    AND coalesce(length(location), 0) <= 200
    AND coalesce(length(reason), 0) <= 1000
    AND length(message) <= 10000
) NOT VALID;
