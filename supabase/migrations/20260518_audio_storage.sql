-- NKHB Audio Storage Bucket and RLS Policies
-- Description: Creates the 'audio' bucket and grants authenticated users (Admins) permission to manage audio files.

-- 1. Ensure the 'audio' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Policy: Allow authenticated users (Admins) to upload files to the 'audio' bucket
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admins to upload audio') THEN
        CREATE POLICY "Allow admins to upload audio"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'audio');
    END IF;
END $$;

-- 3. Policy: Allow authenticated users (Admins) to update/overwrite files in the 'audio' bucket
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admins to update audio') THEN
        CREATE POLICY "Allow admins to update audio"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'audio');
    END IF;
END $$;

-- 4. Policy: Allow authenticated users (Admins) to delete files in the 'audio' bucket
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow admins to delete audio') THEN
        CREATE POLICY "Allow admins to delete audio"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'audio');
    END IF;
END $$;

-- 5. Policy: Allow public to view audio files
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public to view audio') THEN
        CREATE POLICY "Allow public to view audio"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'audio');
    END IF;
END $$;
