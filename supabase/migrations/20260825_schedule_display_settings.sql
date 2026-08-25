-- From 2026-08-31 (KST), show one active broadcast schedule card.
-- Admins can later switch between one and two cards without a schema change.
INSERT INTO public.sites_settings (key, value_ko, value_en)
VALUES
    ('schedule_box_count', '1', '1'),
    ('schedule_box_count_effective_from', '2026-08-31', '2026-08-31'),
    ('default_og_image', 'https://nkhb.org/images/nkhb-social-logo-20260825.png', 'https://nkhb.org/images/nkhb-social-logo-20260825.png')
ON CONFLICT (key) DO UPDATE SET
    value_ko = EXCLUDED.value_ko,
    value_en = EXCLUDED.value_en,
    updated_at = now();
