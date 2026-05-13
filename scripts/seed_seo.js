import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

async function seedSEO() {
  console.log('Seeding initial SEO settings into Supabase...');

  const seoData = [
    {
      page_slug: 'home',
      title_ko: '뉴코리아 희망방송 (NKHB)',
      title_en: 'New Korea Hope Broadcasting (NKHB)',
      description_ko: '라디오 전파를 통해 북한 주민들에게 희망과 진실을 전합니다.',
      description_en: 'Delivering hope and truth to North Korean people through radio waves.',
      og_image_url: 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png'
    },
    {
      page_slug: 'about',
      title_ko: 'NKFI 소개 | 뉴코리아 희망방송',
      title_en: 'About NKFI | NKHB',
      description_ko: '뉴코리아 파운데이션 인터내셔널(NKFI) 사역 소개입니다.',
      description_en: 'Learn about New Korea Foundation International (NKFI) ministries.',
      og_image_url: 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png'
    }
  ];

  const { error } = await supabase
    .from('seo_settings')
    .upsert(seoData, { onConflict: 'page_slug' });

  if (error) {
    console.error('❌ Error seeding SEO:', error.message);
    console.log('💡 Tip: Make sure to create the "seo_settings" table first.');
  } else {
    console.log('✅ Successfully seeded SEO settings.');
  }
}

seedSEO();
