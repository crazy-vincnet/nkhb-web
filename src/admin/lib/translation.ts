/**
 * DeepL Translation Service (client).
 *
 * Calls the server-side proxy at /api/translate so the DeepL API key stays
 * server-only and we avoid DeepL's browser CORS restriction.
 */

import { supabase } from './supabase';

export async function translateText(text: string, targetLang: 'KO' | 'EN'): Promise<string> {
    if (!text || text.trim() === '') return '';

    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ text, targetLang }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `번역 실패: ${response.status}`);
    }

    const data = await response.json();
    if (typeof data?.text !== 'string') {
        throw new Error('번역 결과를 받지 못했습니다.');
    }
    return data.text;
}
