import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

interface BackgroundProps {
    onOpenArticle: () => void;
}

const Background: React.FC<BackgroundProps> = ({ onOpenArticle }) => {
    const { t } = useI18n();

    return (
        <section className="section background" id="background">
            <div className="container">
                <div className="content-grid">
                    <div className="text-content">
                        <span className="section-tag">01 — Background</span>
                        <h2>{t('background_title')}</h2>
                        <p className="description">{t('background_desc1')}</p>

                        <div className="founder-story">
                            <p className="quote" dangerouslySetInnerHTML={{ __html: t('background_quote') }}></p>
                        </div>

                        <p className="description">{t('background_desc2')}</p>

                        <p className="description sub-desc">{t('background_desc3')}</p>

                        <div className="action-area">
                            <Link to="/about" className="btn-hero btn-outline">{t('background_about_nkfi')}</Link>
                            <button 
                                id="open-article-modal" 
                                className="btn-hero btn-outline"
                                onClick={onOpenArticle}
                            >
                                {t('background_read_more')}
                            </button>
                        </div>
                    </div>
                    <div className="image-content">
                        <div className="image-placeholder">
                            <img 
                                src={t('image_background_section')} 
                                alt={t('alt_background')} 
                                loading="lazy" 
                            />
                        </div>
                        <div className="testimonial-box">
                            <span className="testimonial-tag">{t('background_testimonial_tag')}</span>
                            <p className="testimonial-text">{t('background_testimonial_text')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default React.memo(Background);
