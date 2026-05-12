import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyMigration() {
  console.log('Verifying migration...');
  const { data, error } = await supabase
    .from('cms_pages')
    .select('slug, created_at')
    .order('slug');

  if (error) {
    console.error('Error verifying migration:', error.message);
  } else if (data && data.length > 0) {
    console.log('✅ Migration successful! Found pages:');
    data.forEach(page => {
      console.log(`- Slug: ${page.slug} (Created at: ${page.created_at})`);
    });
  } else {
    console.log('⚠️ No pages found in cms_pages table. Migration might have failed or table is empty.');
  }
}

verifyMigration();
