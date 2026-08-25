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
        value_ko: 'https://urhnvxswnjgjorezqpnk.supabase.co/storage/v1/object/public/assets/cms/logo_url-value_ko-rwcfafca77.webp',
        value_en: 'https://urhnvxswnjgjorezqpnk.supabase.co/storage/v1/object/public/assets/cms/logo_url-value_en-ztnld9kqurg.webp'
      }
    ], { onConflict: 'key' });

  if (error) {
    console.error('Error seeding logo:', error.message);
  } else {
    console.log('✅ Successfully added/updated logo_url in content table.');
  }
}

seedLogo();
