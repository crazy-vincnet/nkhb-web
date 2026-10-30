/**
 * Cloudflare R2 storage (client).
 *
 * Talks to /api/r2 for presigned URLs so R2 credentials stay server-only;
 * the file itself is PUT directly to R2.
 */

import { supabase } from './supabase';

export type StoragePrefix = 'assets/cms/' | 'audio/posts/' | 'audio/broadcasts/';

async function callR2<T>(body: Record<string, unknown>): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/r2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `저장소 오류: ${response.status}`);
    return data as T;
}

/** Uploads a file and returns its public URL. */
export async function uploadFile(prefix: StoragePrefix, file: Blob, ext: string): Promise<string> {
    const contentType = file.type || 'application/octet-stream';
    const { uploadUrl, publicUrl } = await callR2<{ uploadUrl: string; publicUrl: string }>({
        action: 'sign', prefix, ext, contentType,
    });
    const put = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: file });
    if (!put.ok) throw new Error(`업로드 실패: ${put.status}`);
    return publicUrl;
}

export async function deleteFile(url: string): Promise<void> {
    await callR2({ action: 'delete', url });
}

export async function listFiles(prefix: StoragePrefix): Promise<string[]> {
    const { urls } = await callR2<{ urls: string[] }>({ action: 'list', prefix });
    return urls;
}
