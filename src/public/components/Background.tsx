import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
interface BackgroundProps {
    onOpenArticle: () => void;
    title_ko?: string;
    title_en?: string;
    desc1_ko?: string;
    desc1_en?: string;
    desc2_ko?: string;
    desc2_en?: string;
    desc3_ko?: string;
    desc3_en?: string;
    quote_ko?: string;
    quote_en?: string;
}

const Background: React.FC<BackgroundProps> = (props) => {
    const { t, lang } = useI18n();
    const { onOpenArticle } = props;

    const title = lang === 'ko' ? (props.title_ko || t('background_title')) : (props.title_en || t('background_title'));
    const desc1 = lang === 'ko' ? (props.desc1_ko || t('background_desc1')) : (props.desc1_en || t('background_desc1'));
    const desc2 = lang === 'ko' ? (props.desc2_ko || t('background_desc2')) : (props.desc2_en || t('background_desc2'));
    const desc3 = lang === 'ko' ? (props.desc3_ko || t('background_desc3')) : (props.desc3_en || t('background_desc3'));
    const quote = lang === 'ko' ? (props.quote_ko || t('background_quote')) : (props.quote_en || t('background_quote'));

    return (
        <section className="section background" id="background">
            <div className="container">
                <div className="content-grid">
                    <div className="text-content">
                        <span className="section-tag">01 — Background</span>
                        <h2>{title}</h2>
                        <p className="description">{desc1}</p>

                        <div className="founder-story">
                            <p className="quote" dangerouslySetInnerHTML={{ __html: quote }}></p>
                        </div>

                        <p className="description">{desc2}</p>

                        <p className="description sub-desc">{desc3}</p>

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
...
                    <div className="image-content">
                        <div className="image-placeholder">
                            <img 
                                src="https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png" 
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

export default Background;
