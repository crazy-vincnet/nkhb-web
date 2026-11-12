import React, { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { Play } from 'lucide-react';
import { RadioPlayer, AudioTrack, splitTitle } from '../components/TodayBroadcast';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';

const LISTEN_SEO = {
    title_ko: '방송 듣기 | 뉴코리아 희망방송',
    title_en: 'Listen to the Broadcast | NKHB',
    description_ko: '북한 주민들에게 전해지는 뉴코리아 희망방송을 직접 들어보세요.',
    description_en: 'Listen to the New Korea Hope Broadcasting programs sent to the people of North Korea.',
};

const PAGE_SIZE = 15;

const Listen: React.FC = () => {
    const { lang } = useI18n();
    const t = (ko: string, en: string) => (lang === 'en' ? en : ko);
    const [past, setPast] = useState<AudioTrack[]>([]);
    const [selected, setSelected] = useState<AudioTrack>();

    const [hasMore, setHasMore] = useState(false);

    // Newest published track is "today" (shown by RadioPlayer); the rest are past broadcasts, first PAGE_SIZE, then the rest on "more".
    const load = (offset: number, all: boolean) =>
        supabase
            .from('audio_tracks')
            .select('id, title_ko, title_en, url, publish_at')
            .eq('is_active', true)
            .lte('publish_at', new Date().toISOString())
            .order('publish_at', { ascending: false })
            .range(1 + offset, all ? offset + 1000 : offset + PAGE_SIZE)
            .then(({ data, error }) => {
                if (error) console.error('Error fetching past broadcasts:', error);
                setPast(prev => [...prev.slice(0, offset), ...(data ?? [])]); // slice: idempotent if a load runs twice (StrictMode)
                setHasMore(!all && (data?.length ?? 0) === PAGE_SIZE);
            });

    useEffect(() => { load(0, false); }, []);

    return (
        <main className="listen-page">
            <SEO slug="listen" fallback={LISTEN_SEO} />
            <div className="container listen-container">
                <div className="listen-intro">
                    <span className="section-tag">{t('희망의 전파', 'On the Air')}</span>
                    <h1>{t('오늘의 방송듣기', 'Today\'s Broadcast')}</h1>
                    <p>{t('북한의 밤하늘로 보내는 뉴코리아 희망방송을 지금 들어보세요.', 'Hear the New Korea Hope Broadcasting programs we send into the North Korean night.')}</p>
                </div>
                <RadioPlayer selected={selected} />
                {past.length > 0 && (
                    <section className="past-broadcasts">
                        <h2>{t('지난 방송', 'Past Broadcasts')}</h2>
                        <ul>
                            {past.map(p => {
                                const { label, title } = splitTitle(lang === 'en' ? p.title_en || p.title_ko : p.title_ko);
                                return (
                                    <li key={p.id}>
                                        <button type="button" className="past-item" aria-current={selected?.id === p.id} onClick={() => { setSelected(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                            <span className="past-play"><Play /></span>
                                            <span className="past-text">
                                                {label && <span className="past-label">{label}</span>}
                                                <span className="past-title">{title}</span>
                                            </span>
                                            <time>{p.publish_at?.slice(0, 10).replace(/-/g, '.')}</time>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        {hasMore && (
                            <button type="button" className="past-more" onClick={() => load(past.length, true)}>{t('더보기', 'Load more')}</button>
                        )}
                    </section>
                )}
            </div>
        </main>
    );
};

export default Listen;
