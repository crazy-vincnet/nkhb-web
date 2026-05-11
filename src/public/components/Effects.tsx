import React from 'react';
import { useI18n } from '../lib/i18n';

const Effects: React.FC = () => {
    const { t } = useI18n();

    return (
        <section className="section effects" id="effects">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">03 — Expected Impact</span>
                    <h2>{t('effects_title')}</h2>
                    <p className="description">{t('effects_desc')}</p>
                </div>

                <div className="effects-grid">
                    <div className="effect-card">
                        <span className="effect-num">01</span>
                        <h3>{t('effects_card1_title')}</h3>
                        <p>{t('effects_card1_desc')}</p>
                    </div>
                    <div className="effect-card">
                        <span className="effect-num">02</span>
                        <h3>{t('effects_card2_title')}</h3>
                        <p>{t('effects_card2_desc')}</p>
                    </div>
                    <div className="effect-card">
                        <span className="effect-num">03</span>
                        <h3>{t('effects_card3_title')}</h3>
                        <p>{t('effects_card3_desc')}</p>
                    </div>
                    <div className="effect-card">
                        <span className="effect-num">04</span>
                        <h3>{t('effects_card4_title')}</h3>
                        <p>{t('effects_card4_desc')}</p>
                    </div>
                    <div className="effect-card">
                        <span className="effect-num">05</span>
                        <h3>{t('effects_card5_title')}</h3>
                        <p>{t('effects_card5_desc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Effects;
