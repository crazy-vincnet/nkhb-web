-- NKHB Supabase Storage RLS Policies
-- Description: Grants authenticated users (Admins) permission to manage files in the 'assets' bucket.

-- 1. Ensure the 'assets' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Enable RLS on storage.objects (if not already enabled)
-- Note: This is usually enabled by default in Supabase.

-- 3. Policy: Allow authenticated users to upload files to the 'cms/' folder
CREATE POLICY "Allow admins to upload assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assets' AND (storage.foldername(name))[1] = 'cms');

-- 4. Policy: Allow authenticated users to update/overwrite files in the 'cms/' folder
CREATE POLICY "Allow admins to update assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assets' AND (storage.foldername(name))[1] = 'cms');

-- 5. Policy: Allow authenticated users to delete files in the 'cms/' folder
CREATE POLICY "Allow admins to delete assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assets' AND (storage.foldername(name))[1] = 'cms');

-- 6. Policy: Allow public to view assets (if not already public)
CREATE POLICY "Allow public to view assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');
