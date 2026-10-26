import { FFmpeg } from '@ffmpeg/ffmpeg';
import coreURL from '@ffmpeg/core?url';
import wasmURL from '@ffmpeg/core/wasm?url';

// Supabase project upload limit.
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

const getDuration = (file: File) => new Promise<number>((resolve) => {
  const url = URL.createObjectURL(file);
  const audio = new Audio();
  audio.preload = 'metadata';
  audio.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(audio.duration); };
  audio.onerror = () => { URL.revokeObjectURL(url); resolve(NaN); };
  audio.src = url;
});

/**
 * Re-encodes audio over the upload limit to mono MP3 in the browser (ffmpeg.wasm).
 * Uses 96kbps like scripts/upload_broadcasts.js, lowered for long files so the result fits.
 * Files already under the limit are returned untouched.
 */
export const fitAudioForUpload = async (file: File, onProgress?: (ratio: number) => void): Promise<File> => {
  if (file.size <= MAX_UPLOAD_BYTES) return file;

  const duration = await getDuration(file);
  // 5% headroom for MP3 framing; 32kbps floor keeps speech intelligible.
  const kbps = Number.isFinite(duration)
    ? Math.max(32, Math.min(96, Math.floor((MAX_UPLOAD_BYTES * 8 * 0.95) / duration / 1000)))
    : 64;

  const ffmpeg = new FFmpeg();
  if (onProgress) ffmpeg.on('progress', ({ progress }) => onProgress(Math.min(1, Math.max(0, progress))));
  try {
    await ffmpeg.load({ coreURL, wasmURL });
    await ffmpeg.writeFile('in', new Uint8Array(await file.arrayBuffer()));
    const code = await ffmpeg.exec(['-i', 'in', '-vn', '-map_metadata', '-1', '-ac', '1', '-b:a', `${kbps}k`, 'out.mp3']);
    if (code !== 0) throw new Error('오디오 압축에 실패했습니다. 지원하지 않는 형식일 수 있습니다.');
    const data = await ffmpeg.readFile('out.mp3') as Uint8Array;
    const out = new File([data.slice().buffer], file.name.replace(/\.[^.]+$/, '') + '.mp3', { type: 'audio/mpeg' });
    if (out.size > MAX_UPLOAD_BYTES) throw new Error('압축 후에도 50MB를 넘습니다. 파일을 나눠서 업로드해 주세요.');
    return out;
  } catch (e) {
    // ffmpeg.wasm rejects with plain strings from its worker; wrap so callers can read .message.
    throw e instanceof Error ? e : new Error(`오디오 압축 실패: ${String(e)}`);
  } finally {
    ffmpeg.terminate();
  }
};
