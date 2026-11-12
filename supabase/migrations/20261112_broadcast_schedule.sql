-- Per-broadcast program schedule image (uploaded with the track in the admin).
ALTER TABLE public.audio_tracks ADD COLUMN IF NOT EXISTS schedule_url TEXT;
