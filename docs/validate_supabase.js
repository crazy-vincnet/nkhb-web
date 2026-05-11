import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase credentials
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.url.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('Testing Supabase connection and schema...');

  // 1. Test 'content' table
  const { data: content, error: contentError } = await supabase
    .from('content')
    .select('*')
    .limit(1);
  
  if (contentError) {
    console.error('❌ Error querying "content" table:', contentError.message);
  } else {
    console.log('✅ "content" table is accessible.');
  }

  // 2. Test 'audio_tracks' table
  const { data: audio, error: audioError } = await supabase
    .from('audio_tracks')
    .select('*')
    .limit(1);
  
  if (audioError) {
    console.error('❌ Error querying "audio_tracks" table:', audioError.message);
  } else {
    console.log('✅ "audio_tracks" table is accessible.');
  }

  // 3. Test 'schedule' table
  const { data: schedule, error: scheduleError } = await supabase
    .from('schedule')
    .select('*')
    .limit(1);
  
  if (scheduleError) {
    console.error('❌ Error querying "schedule" table:', scheduleError.message);
  } else {
    console.log('✅ "schedule" table is accessible.');
  }

  // 4. Test 'letters' table (Insert)
  const testLetter = {
    name: 'Test User',
    location: 'Test Location',
    email: 'test@example.com',
    reason: 'Testing connection',
    message: 'This is a test message from the validation script.'
  };

  const { error: letterError } = await supabase
    .from('letters')
    .insert([testLetter]);
  
  if (letterError) {
    console.error('❌ Error inserting into "letters" table:', letterError.message);
  } else {
    console.log('✅ "letters" table insertion works.');
  }

  console.log('Validation complete.');
}

testConnection();
