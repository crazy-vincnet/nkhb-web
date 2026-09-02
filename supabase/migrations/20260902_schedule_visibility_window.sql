-- Per-item exposure window for broadcast schedule cards.
-- NULL on either side means "no bound" (visible from forever / until forever),
-- so existing rows keep their current always-on behaviour.
ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS visible_from TIMESTAMPTZ;
ALTER TABLE public.schedule ADD COLUMN IF NOT EXISTS visible_until TIMESTAMPTZ;

COMMENT ON COLUMN public.schedule.visible_from IS
    'Public site shows this card only at/after this instant. NULL = no lower bound. Admin UI enters it as KST.';
COMMENT ON COLUMN public.schedule.visible_until IS
    'Public site hides this card after this instant. NULL = no upper bound. Admin UI enters it as KST.';

-- Public list queries filter on the window, so index the bounds.
CREATE INDEX IF NOT EXISTS schedule_visibility_idx
    ON public.schedule (is_active, visible_from, visible_until);
