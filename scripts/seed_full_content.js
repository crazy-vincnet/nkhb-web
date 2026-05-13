import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

async function updateSchemaAndSeed() {
  console.log('Starting schema update and seeding...');

  // 1. Add category column (if possible via RPC or direct query - but Supabase JS doesn't easily support DDL)
  // Instead of DDL, we'll just use a key naming convention: 'section_key'
  
  const translations = {
    en: {
        // Meta & SEO
        meta_description: "New Korea Hope Broadcasting (NKHB) is a radio station that delivers hope, truth, and the gospel to the people of North Korea through radio waves.",
        // Hero Section
        hero_tag: "North Korea Hope Broadcasting(NKHB)",
        hero_title: "In the Night of North Korea</br>We Bring Truth and Hope",
        hero_subtitle: "“The truth will set you free.”",
        hero_button_about: "Learn More",
        hero_button_letter: "Send a Letter of Hope",
        // Images
        image_hero_bg: "/images/main-hero.png",
        image_logo: "https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png",
        image_background_section: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_reach_map: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_about_poster: "/images/poster.png",
        image_about_kenneth: "/images/kenneth-bae.png",
        // ... more can be added later
    },
    ko: {
        // Meta & SEO
        meta_description: "뉴코리아 희망방송(NKHB)은 라디오 전파를 통해 북한 주민들에게 희망과 진실, 그리고 복음을 전하는 대북 라디오 방송입니다.",
        // Hero Section
        hero_tag: "뉴코리아 희망방송(NKHB)",
        hero_title: "북한의 밤에</br>진실과 희망을 전합니다",
        hero_subtitle: "“진리가 너희를 자유케 하리니”",
        hero_button_about: "방송소개 보기",
        hero_button_letter: "희망의 편지 보내기",
        // Images
        image_hero_bg: "/images/main-hero.png",
        image_logo: "https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png",
        image_background_section: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_reach_map: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_about_poster: "/images/poster.png",
        image_about_kenneth: "/images/kenneth-bae.png",
    }
  };

  const keys = Object.keys(translations.en);
  const dataToUpsert = keys.map(key => ({
    key: key,
    value_ko: translations.ko[key],
    value_en: translations.en[key]
  }));

  console.log(`Upserting ${dataToUpsert.length} items...`);

  const { error } = await supabase
    .from('content')
    .upsert(dataToUpsert, { onConflict: 'key' });

  if (error) {
    console.error('Error seeding data:', error.message);
  } else {
    console.log('✅ Successfully seeded content table.');
  }
}

updateSchemaAndSeed();
