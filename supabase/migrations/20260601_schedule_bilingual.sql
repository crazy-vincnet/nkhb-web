-- Make the broadcast schedule day label bilingual (Korean / English).
-- time and frequency stay single-column (language-neutral: "02:30-03:00", "5920 kHz").

ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS day_ko TEXT;
ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS day_en TEXT;

-- Backfill from the existing single `day` column.
UPDATE public.schedule
SET
    day_ko = COALESCE(day_ko, day),
    day_en = COALESCE(day_en, day)
WHERE day_ko IS NULL OR day_en IS NULL;

-- The app now writes day_ko/day_en instead of `day`. Relax the old constraints
-- so inserts no longer require the legacy column, and drop the (day, time)
-- uniqueness that assumed a single-language day. `day` is kept (nullable) for
-- backward compatibility and can be dropped once nothing reads it.
ALTER TABLE public.schedule ALTER COLUMN day DROP NOT NULL;
ALTER TABLE public.schedule DROP CONSTRAINT IF EXISTS schedule_day_time_key;
