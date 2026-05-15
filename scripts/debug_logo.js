import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .or('key.eq.logo_url,key.eq.image_logo');
  if (error) console.error('Error fetching content:', error);
  else console.log('Logo content rows:', data);
}
run();
