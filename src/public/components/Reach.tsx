import React from 'react';
import { useI18n } from '../lib/i18n';

const Reach: React.FC = () => {
    const { t } = useI18n();

    return (
        <section className="section reach" id="reach">
            <div className="container">
                <div className="reach-grid">
                    <div className="reach-visual">
                        <div className="map-container">
                            <img 
                                src={t('image_reach_map')} 
                                alt={t('alt_map')}
                                className="map-bg" 
                                loading="lazy" 
                            />
                            <div className="pulse-ring"></div>
                            <div className="pulse-ring delay-1"></div>
                            <div className="pulse-ring delay-2"></div>
                        </div>
                    </div>
                    <div className="reach-text">
                        <span className="section-tag">04 — Broadcast Reach</span>
                        <h2 dangerouslySetInnerHTML={{ __html: t('reach_title') }}></h2>
                        <p className="description">{t('reach_desc')}</p>
                        <div className="reach-details">
                            <p>{t('reach_details1')}</p>
                            <p className="highlight">{t('reach_details2')}</p>
                        </div>
                        <div className="reach-features">
                            <div className="feature-item">
                                <span className="dot"></span>
                                <p>{t('reach_feature1')}</p>
                            </div>
                            <div className="feature-item">
                                <span className="dot"></span>
                                <p>{t('reach_feature2')}</p>
                            </div>
                            <div className="feature-item">
                                <span className="dot"></span>
                                <p>{t('reach_feature3')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reach;
