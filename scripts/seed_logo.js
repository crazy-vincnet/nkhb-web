import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Environment variables missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedLogo() {
  console.log('Seeding logo_url into content table...');
  
  const { data, error } = await supabase
    .from('content')
    .upsert([
      { 
        key: 'logo_url', 
        value_ko: 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png', 
        value_en: 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png' 
      }
    ], { onConflict: 'key' });

  if (error) {
    console.error('Error seeding logo:', error.message);
  } else {
    console.log('✅ Successfully added/updated logo_url in content table.');
  }
}

seedLogo();
