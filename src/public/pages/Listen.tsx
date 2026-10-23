import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import SEO from '../components/SEO';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';

interface AudioTrack {
    id: string;
    title_ko: string;
    title_en: string;
    url: string;
    order: number;
    is_active: boolean;
}

const LISTEN_SEO = {
    title_ko: '방송 듣기 | 뉴코리아 희망방송',
    title_en: 'Listen to the Broadcast | NKHB',
    description_ko: '북한 주민들에게 전해지는 뉴코리아 희망방송을 직접 들어보세요.',
    description_en: 'Listen to the New Korea Hope Broadcasting programs sent to the people of North Korea.',
};

// Dial scale labels, purely decorative (shortwave band in MHz).
const DIAL_MARKS = ['5.9', '6.2', '7.1', '7.4', '9.4', '9.9', '11.6', '12.1'];

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

const Listen: React.FC = () => {
    const { lang } = useI18n();
    const [tracks, setTracks] = useState<AudioTrack[]>([]);
    const [index, setIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const audioRef = useRef<HTMLAudioElement>(null);
    const shouldAutoplay = useRef(false);

    useEffect(() => {
        const fetchTracks = async () => {
            const { data, error } = await supabase
                .from('audio_tracks')
                .select('*')
                .eq('is_active', true)
                .order('order', { ascending: true });

            if (error) {
                console.error('Error fetching tracks:', error);
            } else if (data) {
                setTracks(data);
            }
        };

        fetchTracks();
    }, []);

    const current = tracks[index];
    const titleOf = (t: AudioTrack) => (lang === 'en' ? t.title_en || t.title_ko : t.title_ko);

    // A new track loads with its src; play it once loaded if the user asked for playback.
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !current) return;
        setTime(0);
        setDuration(0);
        if (shouldAutoplay.current) {
            audio.play().catch(() => { /* autoplay may be blocked; user can press play */ });
        }
    }, [current]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const selectTrack = (i: number) => {
        if (!tracks.length) return;
        shouldAutoplay.current = true;
        if (i === index) {
            audioRef.current?.play().catch(() => {});
            return;
        }
        setIndex((i + tracks.length) % tracks.length);
    };

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || !current) return;
        if (audio.paused) {
            shouldAutoplay.current = true;
            audio.play().catch(() => {});
        } else {
            shouldAutoplay.current = false;
            audio.pause();
        }
    };

    const seek = (value: number) => {
        if (audioRef.current) audioRef.current.currentTime = value;
        setTime(value);
    };

    const needle = tracks.length > 1 ? 4 + (index / (tracks.length - 1)) * 92 : 50;
    const freq = (5.9 + (needle / 100) * 6.2).toFixed(2);
    const t = (ko: string, en: string) => (lang === 'en' ? en : ko);

    return (
        <main className="listen-page">
            <SEO slug="listen" fallback={LISTEN_SEO} />
            <div className="container listen-container">
                <div className="listen-intro">
                    <span className="section-tag">{t('희망의 전파', 'On the Air')}</span>
                    <h1>{t('방송 듣기', 'Listen to the Broadcast')}</h1>
                    <p>{t('북한의 밤하늘로 보내는 뉴코리아 희망방송을 지금 들어보세요.', 'Hear the New Korea Hope Broadcasting programs we send into the North Korean night.')}</p>
                </div>

                <section className={`radio ${isPlaying ? 'is-playing' : ''}`} aria-label={t('라디오 플레이어', 'Radio player')}>
                    <div className="radio-body">
                        <div className="radio-speaker" aria-hidden="true">
                            <div className="radio-grille" />
                            <div className="radio-brand">NKHB</div>
                        </div>

                        <div className="radio-panel">
                            <div className="radio-topline">
                                <span className="radio-onair"><i />ON AIR</span>
                                <span className="radio-freq">SW {freq} MHz</span>
                            </div>

                            <div className="radio-dial" aria-hidden="true">
                                <div className="radio-scale">
                                    {DIAL_MARKS.map(m => <span key={m}>{m}</span>)}
                                </div>
                                <div className="radio-ticks" />
                                <div className="radio-needle" style={{ left: `${needle}%` }} />
                            </div>

                            <div className="radio-display" aria-live="polite">
                                <div className="radio-channel">
                                    CH {String(index + 1).padStart(2, '0')}{current && splitTitle(titleOf(current)).label && ` · ${splitTitle(titleOf(current)).label}`}
                                </div>
                                <div className="radio-title">{current ? splitTitle(titleOf(current)).title : t('채널을 불러오는 중…', 'Tuning in…')}</div>
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
                                <button className="radio-key" onClick={() => selectTrack(index - 1)} aria-label={t('이전 채널', 'Previous channel')}>
                                    <SkipBack size={18} />
                                </button>
                                <button className="radio-knob" onClick={togglePlay} aria-label={isPlaying ? t('일시정지', 'Pause') : t('재생', 'Play')}>
                                    {isPlaying ? <Pause size={26} /> : <Play size={26} />}
                                </button>
                                <button className="radio-key" onClick={() => selectTrack(index + 1)} aria-label={t('다음 채널', 'Next channel')}>
                                    <SkipForward size={18} />
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
                        src={current?.url}
                        preload="metadata"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onTimeUpdate={e => setTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
                        onEnded={() => selectTrack(index + 1)}
                    />
                </section>

                <section className="radio-channels" aria-label={t('채널 목록', 'Channels')}>
                    <h2>{t('채널 목록', 'Channels')} <small>{tracks.length}</small></h2>
                    <ol>
                        {tracks.map((track, i) => {
                            const { label, title } = splitTitle(titleOf(track));
                            return (
                                <li key={track.id}>
                                    <button
                                        className={i === index ? 'active' : ''}
                                        onClick={() => selectTrack(i)}
                                        aria-current={i === index ? 'true' : undefined}
                                    >
                                        <span className="ch-num">{String(i + 1).padStart(2, '0')}</span>
                                        <span className="ch-text">
                                            {label && <span className="ch-label">{label}</span>}
                                            <span className="ch-title">{title}</span>
                                        </span>
                                        <span className="ch-state">
                                            {i === index && isPlaying
                                                ? <span className="ch-eq" aria-label={t('재생 중', 'Playing')}><i /><i /><i /></span>
                                                : <Play size={14} aria-hidden="true" />}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </section>
            </div>
        </main>
    );
};

export default Listen;
