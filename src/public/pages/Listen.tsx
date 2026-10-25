import React from 'react';
import SEO from '../components/SEO';
import { RadioPlayer } from '../components/TodayBroadcast';
import { useI18n } from '../lib/i18n';

const LISTEN_SEO = {
    title_ko: '방송 듣기 | 뉴코리아 희망방송',
    title_en: 'Listen to the Broadcast | NKHB',
    description_ko: '북한 주민들에게 전해지는 뉴코리아 희망방송을 직접 들어보세요.',
    description_en: 'Listen to the New Korea Hope Broadcasting programs sent to the people of North Korea.',
};

// Only today's broadcast is public; past broadcasts are not listed (copyright).
const Listen: React.FC = () => {
    const { lang } = useI18n();
    const t = (ko: string, en: string) => (lang === 'en' ? en : ko);

    return (
        <main className="listen-page">
            <SEO slug="listen" fallback={LISTEN_SEO} />
            <div className="container listen-container">
                <div className="listen-intro">
                    <span className="section-tag">{t('희망의 전파', 'On the Air')}</span>
                    <h1>{t('오늘의 방송듣기', 'Today\'s Broadcast')}</h1>
                    <p>{t('북한의 밤하늘로 보내는 뉴코리아 희망방송을 지금 들어보세요.', 'Hear the New Korea Hope Broadcasting programs we send into the North Korean night.')}</p>
                </div>
                <RadioPlayer />
            </div>
        </main>
    );
};

export default Listen;
