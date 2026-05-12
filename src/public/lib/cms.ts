import { supabase } from './supabase';

export interface CMSPage {
  id: string;
  slug: string;
  layout_json: any;
  seo_title_ko: string;
  seo_title_en: string;
  seo_description_ko: string;
  seo_description_en: string;
  seo_image_url: string;
}

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  const { data, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    // PGRST116 is the error code for "no rows found"
    if (error.code !== 'PGRST116') {
      console.error(`Error fetching page with slug ${slug}:`, error);
    }
    return null;
  }

  return data;
}
