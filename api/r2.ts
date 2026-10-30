import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { AwsClient } from 'aws4fetch';

/**
 * Cloudflare R2 storage proxy (admin-only).
 *
 * R2 credentials stay server-side. Uploads don't pass through here: we hand out
 * a short-lived presigned PUT URL and the browser sends the file straight to R2,
 * which also sidesteps Vercel's 4.5MB request body limit.
 *
 * Actions (POST JSON body):
 *   { action: 'sign', prefix, ext, contentType } -> { uploadUrl, publicUrl }
 *   { action: 'delete', url }                    -> { ok: true }
 *   { action: 'list', prefix }                   -> { urls: string[] }
 */

// Folders the admin UI writes to; anything else is rejected.
const ALLOWED_PREFIXES = ['assets/cms/', 'audio/posts/', 'audio/broadcasts/'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = (req.headers.authorization || '').replace(/^Bearer /i, '');
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!token || !supabaseUrl || !anonKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { data: isAdmin, error: authError } = await createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  }).rpc('is_admin');
  if (authError || isAdmin !== true) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
  const publicBase = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !publicBase) {
    console.error('R2 env missing');
    return res.status(500).json({ error: '저장소가 설정되지 않았습니다.' });
  }

  const r2 = new AwsClient({
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  });
  const bucketUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}`;
  const { action, prefix, ext, contentType, url } = req.body || {};

  try {
    if (action === 'sign') {
      if (!ALLOWED_PREFIXES.includes(prefix)) return res.status(400).json({ error: 'Invalid prefix' });
      const safeExt = typeof ext === 'string' && /^[a-z0-9]{1,8}$/i.test(ext) ? ext.toLowerCase() : 'bin';
      const key = `${prefix}${crypto.randomUUID()}.${safeExt}`;
      const putUrl = new URL(`${bucketUrl}/${key}`);
      putUrl.searchParams.set('X-Amz-Expires', '600');
      const signed = await r2.sign(
        new Request(putUrl, {
          method: 'PUT',
          headers: { 'Content-Type': typeof contentType === 'string' && contentType ? contentType : 'application/octet-stream' },
        }),
        { aws: { signQuery: true } }
      );
      return res.status(200).json({ uploadUrl: signed.url, publicUrl: `${publicBase}/${key}` });
    }

    if (action === 'delete') {
      if (typeof url !== 'string' || !url.startsWith(`${publicBase}/`)) {
        return res.status(400).json({ error: 'Invalid url' });
      }
      const key = url.slice(publicBase.length + 1);
      if (!ALLOWED_PREFIXES.some(p => key.startsWith(p))) return res.status(400).json({ error: 'Invalid url' });
      const r = await r2.fetch(`${bucketUrl}/${key}`, { method: 'DELETE' });
      if (!r.ok) throw new Error(`R2 delete ${r.status}`);
      return res.status(200).json({ ok: true });
    }

    if (action === 'list') {
      if (!ALLOWED_PREFIXES.includes(prefix)) return res.status(400).json({ error: 'Invalid prefix' });
      // ponytail: first 1000 keys only (one ListObjectsV2 page); add continuation-token loop if the folder grows past that.
      const r = await r2.fetch(`${bucketUrl}?list-type=2&prefix=${encodeURIComponent(prefix)}`);
      if (!r.ok) throw new Error(`R2 list ${r.status}`);
      const xml = await r.text();
      const urls = [...xml.matchAll(/<Key>([^<]+)<\/Key>/g)].map(m => `${publicBase}/${m[1]}`);
      return res.status(200).json({ urls });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error: any) {
    console.error('R2 error:', error);
    return res.status(502).json({ error: '저장소 요청에 실패했습니다.' });
  }
}
