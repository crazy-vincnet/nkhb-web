-- Today's broadcast: the public site plays only the latest published track.
-- Tracks can be scheduled ahead (e.g. over long holidays) via publish_at;
-- "today" is simply the newest active track whose publish_at has passed.

ALTER TABLE public.audio_tracks ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Backfill: bulk-uploaded files are named NKHB_YYYYMMDD.mp3 and go public at 00:00 KST that day;
-- anything else keeps its upload time.
UPDATE public.audio_tracks
SET publish_at = COALESCE(
    (substring(url FROM 'NKHB_(\d{8})\.mp3') || ' 00:00 Asia/Seoul')::timestamptz,
    created_at
);

CREATE INDEX IF NOT EXISTS audio_tracks_publish_at_idx ON public.audio_tracks (publish_at DESC);

-- Visitors must not see inactive or scheduled (future) tracks. Admin access is a separate policy.
DROP POLICY IF EXISTS "Public can select audio_tracks" ON public.audio_tracks;
CREATE POLICY "Public can select audio_tracks" ON public.audio_tracks
    FOR SELECT USING (is_active AND publish_at <= now());

-- Current shortwave frequency, editable from the admin Audio page.
INSERT INTO public.sites_settings (key, value_ko, value_en)
VALUES ('radio_freq_khz', '9445', '9445')
ON CONFLICT (key) DO NOTHING;

-- Put the new home section right after the hero on an already-saved layout.
DO $$
BEGIN
    UPDATE public.content
    SET style_props = jsonb_insert(style_props, '{order,1}', '"today_radio"')
    WHERE key = 'page_layout_home'
      AND jsonb_typeof(style_props->'order') = 'array'
      AND NOT (style_props->'order') ? 'today_radio';
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Layout not updated (%); add "today_radio" from the admin Content page.', SQLERRM;
END $$;
