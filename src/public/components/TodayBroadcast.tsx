import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';

interface AudioTrack {
    id: string;
    title_ko: string;
    title_en: string;
    url: string;
}

// Shortwave dial, evenly spaced 6–12 MHz so the needle can point at the real frequency.
const DIAL_MIN_MHZ = 6;
const DIAL_MAX_MHZ = 12;
const DIAL_MARKS = [6, 7, 8, 9, 10, 11, 12];
const DEFAULT_FREQ_KHZ = 9445;

// 0..1 position of a frequency on the dial, clamped to its ends.
export const dialPosition = (khz: number) =>
    Math.min(1, Math.max(0, (khz / 1000 - DIAL_MIN_MHZ) / (DIAL_MAX_MHZ - DIAL_MIN_MHZ)));

// Same inset as .radio-ticks (16px each side, last tick 1px wide).
const dialLeft = (p: number) => `calc(16.5px + ${p} * (100% - 33px))`;

const formatTime = (sec: number) => {
    if (!isFinite(sec) || sec < 0) return '00:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

// CMS titles look like "자유시리즈 01_자유란 무엇입니까?" or "02_말할 자유":
// show the part before "_" as a small label and the rest as the title.
const splitTitle = (raw: string) => {
    const i = raw.indexOf('_');
    if (i <= 0) return { label: '', title: raw.trim() };
    const label = raw.slice(0, i).trim();
    return { label: /^\d+$/.test(label) ? `EP ${label}` : label, title: raw.slice(i + 1).trim() };
};

// Plays today's broadcast: the newest active track whose publish_at has passed.
// Scheduled tracks take over automatically once their time comes.
export const RadioPlayer: React.FC = () => {
    const { lang } = useI18n();
    const [track, setTrack] = useState<AudioTrack | null | undefined>(undefined);
    const [freqKhz, setFreqKhz] = useState(DEFAULT_FREQ_KHZ);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        Promise.all([
            supabase
                .from('audio_tracks')
                .select('id, title_ko, title_en, url')
                .eq('is_active', true)
                .lte('publish_at', new Date().toISOString())
                .order('publish_at', { ascending: false })
                .limit(1)
                .maybeSingle(),
            supabase.from('sites_settings').select('value_ko').eq('key', 'radio_freq_khz').maybeSingle(),
        ]).then(([trackResult, freqResult]) => {
            if (trackResult.error) console.error('Error fetching today\'s broadcast:', trackResult.error);
            setTrack(trackResult.data ?? null);
            const khz = Number(freqResult.data?.value_ko);
            if (khz > 0) setFreqKhz(khz);
        });
    }, []);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !track) return;
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
    };

    const seek = (value: number) => {
        if (audioRef.current) audioRef.current.currentTime = value;
        setTime(value);
    };

    const t = (ko: string, en: string) => (lang === 'en' ? en : ko);
    const { label, title } = track
        ? splitTitle(lang === 'en' ? track.title_en || track.title_ko : track.title_ko)
        : { label: '', title: track === null ? t('오늘의 방송을 준비 중입니다.', 'Today\'s broadcast is coming soon.') : t('채널을 불러오는 중…', 'Tuning in…') };

    return (
        <section className={`radio ${isPlaying ? 'is-playing' : ''}`} aria-label={t('라디오 플레이어', 'Radio player')}>
            <div className="radio-body">
                <div className="radio-speaker" aria-hidden="true">
                    <div className="radio-grille" />
                    <div className="radio-brand">NKHB</div>
                </div>

                <div className="radio-panel">
                    <div className="radio-topline">
                        <span className="radio-onair"><i />ON AIR</span>
                        <span className="radio-freq">SW {+(freqKhz / 1000).toFixed(3)} MHz</span>
                    </div>

                    <div className="radio-dial" aria-hidden="true">
                        <div className="radio-scale">
                            {DIAL_MARKS.map(m => (
                                <span key={m} style={{ left: dialLeft((m - DIAL_MIN_MHZ) / (DIAL_MAX_MHZ - DIAL_MIN_MHZ)) }}>{m}</span>
                            ))}
                        </div>
                        <div className="radio-ticks" />
                        <div className="radio-needle" style={{ left: dialLeft(dialPosition(freqKhz)) }} />
                    </div>

                    <div className="radio-display" aria-live="polite">
                        <div className="radio-channel">TODAY{label && ` · ${label}`}</div>
                        <div className="radio-title">{title}</div>
                        <div className="radio-time">{formatTime(time)} / {formatTime(duration)}</div>
                    </div>

                    <input
                        className="radio-seek"
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={1}
                        value={time}
                        onChange={e => seek(Number(e.target.value))}
                        aria-label={t('재생 위치', 'Seek')}
                        disabled={!duration}
                        style={{ '--p': `${duration ? (time / duration) * 100 : 0}%` } as React.CSSProperties}
                    />

                    <div className="radio-controls">
                        <button className="radio-knob" onClick={togglePlay} disabled={!track} aria-label={isPlaying ? t('일시정지', 'Pause') : t('재생', 'Play')}>
                            {isPlaying ? <Pause size={26} /> : <Play size={26} />}
                        </button>
                        <label className="radio-volume">
                            <Volume2 size={16} aria-hidden="true" />
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={volume}
                                onChange={e => setVolume(Number(e.target.value))}
                                aria-label={t('음량', 'Volume')}
                                style={{ '--p': `${volume * 100}%` } as React.CSSProperties}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={track?.url}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
                onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
            />
        </section>
    );
};

// Home section: today's broadcast only (past broadcasts stay private for copyright reasons).
const TodayBroadcast: React.FC = () => {
    const { lang } = useI18n();
    const t = (ko: string, en: string) => (lang === 'en' ? en : ko);

    return (
        <section className="section today-broadcast" id="today-broadcast">
            <div className="container listen-container">
                <div className="section-header">
                    <span className="section-tag">{t('희망의 전파', 'On the Air')}</span>
                    <h2>{t('오늘의 방송듣기', 'Today\'s Broadcast')}</h2>
                </div>
                <RadioPlayer />
            </div>
        </section>
    );
};

export default TodayBroadcast;
