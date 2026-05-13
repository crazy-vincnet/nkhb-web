import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

async function inspectTable() {
  console.log('Inspecting "posts" table columns...');
  
  // This query works on PostgreSQL to list columns
  const { data, error } = await supabase.rpc('inspect_columns', { table_name: 'posts' });
  
  if (error) {
    // If RPC doesn't exist (likely), try a simple select with limit 0
    console.log('RPC failed or missing, trying alternative method...');
    const { data: colData, error: colError } = await supabase
      .from('posts')
      .select('*')
      .limit(0);
      
    if (colError) {
      console.error('❌ Error accessing posts table:', colError.message);
    } else {
      console.log('✅ Successfully accessed posts table.');
      // PostgREST doesn't return column names in an empty select usually in a way we can see here, 
      // but let's try to insert a minimal row to see what fails.
    }
  } else {
    console.log('Table columns:', data);
  }
}

inspectTable();
