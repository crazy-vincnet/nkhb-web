import React, { useEffect, useState, useRef } from 'react';
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

const Listen: React.FC = () => {
    const { lang } = useI18n();
    const [tracks, setTracks] = useState<AudioTrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

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
                if (data.length > 0) {
                    setCurrentTrack(data[0]);
                }
            }
        };

        fetchTracks();
    }, []);

    const playTrack = (track: AudioTrack) => {
        setCurrentTrack(track);
        if (audioRef.current) {
            audioRef.current.src = track.url;
            audioRef.current.play().catch(() => { /* autoplay may be blocked; user can press play */ });
        }
    };

    return (
        <main className="listen-page">
            <SEO slug="listen" fallback={LISTEN_SEO} />
            <div className="container listen-container">
                <h1>{lang === 'en' ? '🎙️ Listen to the Broadcast' : '🎙️ 방송 듣기'}</h1>
                <audio
                    ref={audioRef}
                    controls
                    style={{ width: '100%', marginBottom: '20px' }}
                    src={currentTrack?.url}
                >
                    {lang === 'en' ? 'Your browser does not support the audio element.' : '브라우저가 오디오 재생을 지원하지 않습니다.'}
                </audio>
                <div id="current-track-title" style={{ marginBottom: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {currentTrack ? (lang === 'en' ? currentTrack.title_en : currentTrack.title_ko) : ''}
                </div>
                <div id="track-list" className="track-list">
                    {tracks.map((track) => (
                        <button
                            key={track.id}
                            className={`track-btn ${currentTrack?.id === track.id ? 'active' : ''}`}
                            onClick={() => playTrack(track)}
                        >
                            {lang === 'en' ? track.title_en : track.title_ko}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Listen;
