import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

const Hero: React.FC = () => {
    const { t } = useI18n();

    return (
        <section 
            className="hero" 
            id="hero"
            style={{ 
                background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('${t('image_hero_bg')}') center/cover no-repeat` 
            }}
        >
            <div className="container">
                <div className="hero-content">
                    <span className="hero-tag">{t('hero_tag')}</span>
                    <h1 dangerouslySetInnerHTML={{ __html: t('hero_title') }}></h1>
                    <p>{t('hero_subtitle')}</p>
                    <div className="hero-btns">
                        <Link to="/#background" className="btn-hero btn-fill">{t('hero_button_about')}</Link>
                        <Link to="/#guide" className="btn-hero btn-outline">{t('hero_button_letter')}</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
