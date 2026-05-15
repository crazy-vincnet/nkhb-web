/**
 * DeepL Translation Service
 */

const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;

// Auto-detect Free vs Pro API endpoint based on key suffix
const DEEPL_ENDPOINT = DEEPL_API_KEY?.endsWith(':fx') 
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

export async function translateText(text: string, targetLang: 'KO' | 'EN'): Promise<string> {
    if (!DEEPL_API_KEY) {
        throw new Error('DeepL API Key가 설정되지 않았습니다. .env 파일에 VITE_DEEPL_API_KEY를 추가해주세요.');
    }

    if (!text || text.trim() === '') return '';

    try {
        const params = new URLSearchParams();
        params.append('auth_key', DEEPL_API_KEY);
        params.append('text', text);
        params.append('target_lang', targetLang);
        // Preserve HTML tags if present (useful for our <b>, <br/> usage)
        params.append('tag_handling', 'html');

        const response = await fetch(DEEPL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `DeepL API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.translations[0].text;
    } catch (error: any) {
        console.error('Translation Error:', error);
        throw error;
    }
}
