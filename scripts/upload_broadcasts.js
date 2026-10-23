// Upload broadcast mp3 files (named NKHB_YYYYMMDD.mp3) to Supabase Storage
// (audio bucket, same place the admin Audio page uploads to) and register
// them as audio_tracks, newest first. Skips files already registered.
// Files must be under the project's 50MB upload limit; re-encode first, e.g.
//   ffmpeg -i in.mp3 -map_metadata -1 -ac 1 -b:a 96k out.mp3
// Usage: node --env-file=.env scripts/upload_broadcasts.js <dir>
// Needs SUPABASE_SERVICE_ROLE_KEY in the environment.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const dir = process.argv[2];
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!dir || !key) {
  console.error('Usage: node --env-file=.env scripts/upload_broadcasts.js <dir>  (SUPABASE_SERVICE_ROLE_KEY required)');
  process.exit(1);
}
const supabase = createClient(process.env.VITE_SUPABASE_URL, key);

const files = readdirSync(dir).filter(f => /^NKHB_\d{8}\.mp3$/.test(f)).sort().reverse();
const { data: existing, error: listError } = await supabase.from('audio_tracks').select('url');
if (listError) throw listError;
const known = new Set(existing.map(t => t.url));

for (const [i, file] of files.entries()) {
  const path = `broadcasts/${file}`;
  const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(path);
  if (known.has(publicUrl)) {
    console.log(`skip ${file} (already registered)`);
    continue;
  }

  const { error: uploadError } = await supabase.storage
    .from('audio')
    .upload(path, readFileSync(join(dir, file)), { contentType: 'audio/mpeg', upsert: true });
  if (uploadError) {
    console.error(`upload failed ${file}: ${uploadError.message}`);
    continue;
  }

  const [, y, m, d] = file.match(/(\d{4})(\d{2})(\d{2})/);
  // Negative order puts these ahead of the existing 1..N tracks, newest first.
  const { error } = await supabase.from('audio_tracks').insert({
    title_ko: `희망방송 ${y}년 ${Number(m)}월 ${Number(d)}일`,
    title_en: `NKHB Broadcast – ${y}.${m}.${d}`,
    url: publicUrl,
    order: i - files.length,
    is_active: true,
  });
  console.log(error ? `insert failed ${file}: ${error.message}` : `ok ${file}`);
}
