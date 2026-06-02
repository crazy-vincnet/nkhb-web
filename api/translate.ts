import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Server-side DeepL proxy.
 *
 * The API key lives only in server env (DEEPL_API_KEY) and never reaches the
 * browser bundle. This also avoids DeepL's browser CORS restriction, which made
 * the previous client-side fetch unusable in production.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, targetLang } = req.body || {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing text' });
  }
  if (targetLang !== 'KO' && targetLang !== 'EN') {
    return res.status(400).json({ error: 'Invalid targetLang' });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.error('DEEPL_API_KEY missing');
    return res.status(500).json({ error: '번역 서비스가 설정되지 않았습니다.' });
  }

  // Free-tier keys end in ":fx" and use a different host. The Authorization
  // header auth scheme works for both Free and Pro.
  const endpoint = apiKey.endsWith(':fx')
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  try {
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('target_lang', targetLang);
    // Preserve HTML tags (our content uses <b>, <br/>, etc.)
    params.append('tag_handling', 'html');

    const deeplRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!deeplRes.ok) {
      const errBody = await deeplRes.text().catch(() => '');
      console.error('DeepL API error:', deeplRes.status, errBody);
      return res.status(deeplRes.status).json({ error: `DeepL API Error: ${deeplRes.status}` });
    }

    const data = await deeplRes.json();
    const translated = data?.translations?.[0]?.text;
    if (typeof translated !== 'string') {
      return res.status(502).json({ error: '번역 결과를 받지 못했습니다.' });
    }
    return res.status(200).json({ text: translated });
  } catch (error: any) {
    console.error('Translation error:', error);
    return res.status(500).json({ error: error.message });
  }
}
