-- Add parent_id to support sub-menus
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON public.menu_items(parent_id);
