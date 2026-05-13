-- Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label_ko TEXT NOT NULL,
    label_en TEXT NOT NULL,
    path TEXT NOT NULL,
    "order" INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Public can SELECT
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can select menu_items') THEN
        CREATE POLICY "Public can select menu_items" ON public.menu_items
            FOR SELECT USING (true);
    END IF;
END $$;

-- Admins have full access
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins have full access to menu_items') THEN
        CREATE POLICY "Admins have full access to menu_items" ON public.menu_items
            FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Initial data based on current Header.tsx
INSERT INTO public.menu_items (label_ko, label_en, path, "order") VALUES
('NKFI 소개', 'About Us', '/about', 1),
('방송배경', 'Background', '/#background', 2),
('방송구성', 'Program', '/#composition', 3),
('기대효과', 'Impact', '/#effects', 4),
('참여 안내', 'Get Involved', '/#guide', 5),
('후원하기', 'Donate', '/#support', 6),
('방송시간', 'Schedule', '/#schedule', 7)
ON CONFLICT DO NOTHING;
