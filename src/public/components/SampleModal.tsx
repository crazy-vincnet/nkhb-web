import React, { useEffect, useState, useRef } from 'react';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { useModalBehavior } from '../lib/useModalBehavior';

interface AudioTrack {
    id: string;
    title_ko: string;
    title_en: string;
    url: string;
    order: number;
    is_active: boolean;
}

interface SampleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SampleModal: React.FC<SampleModalProps> = ({ isOpen, onClose }) => {
    const { t, lang } = useI18n();
    const [tracks, setTracks] = useState<AudioTrack[]>([]);
    const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useModalBehavior(isOpen, onClose, contentRef);

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

    useEffect(() => {
        if (!isOpen && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [isOpen]);

    const playTrack = (track: AudioTrack) => {
        setCurrentTrack(track);
        if (audioRef.current) {
            audioRef.current.src = track.url;
            audioRef.current.play().catch(() => { /* autoplay may be blocked; user can press play */ });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="sample-modal-title" ref={contentRef}>
                <div className="modal-header">
                    <h3 id="sample-modal-title">{t('sample_modal_title')}</h3>
                    <button 
                        className="close-modal-sample" 
                        aria-label={t('alt_close')} 
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-body-sample" style={{ padding: '40px', textAlign: 'center' }}>
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
                    <div id="track-list" className="track-list" style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
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
            </div>
        </div>
    );
};

export default SampleModal;
