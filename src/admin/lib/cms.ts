import { supabase } from './supabase';

export interface CMSPageData {
  id?: string;
  slug: string;
  layout_json: any;
  seo_title_ko?: string;
  seo_title_en?: string;
  seo_description_ko?: string;
  seo_description_en?: string;
  seo_image_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches page layout and SEO data from cms_pages by slug.
 */
export const getPage = async (slug: string): Promise<CMSPageData | null> => {
  const { data, error } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error fetching page:', error);
    throw error;
  }

  return data;
};

/**
 * Upserts layout/SEO data for a page identified by slug.
 */
export const savePage = async (slug: string, data: Partial<CMSPageData>): Promise<CMSPageData> => {
  const { data: upsertedData, error } = await supabase
    .from('cms_pages')
    .upsert(
      { 
        ...data, 
        slug, 
        updated_at: new Date().toISOString() 
      }, 
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error saving page:', error);
    throw error;
  }

  return upsertedData;
};
