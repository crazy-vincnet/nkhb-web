import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';

interface HeroProps {
    tag_ko?: string;
    tag_en?: string;
    title_ko?: string;
    title_en?: string;
    subtitle_ko?: string;
    subtitle_en?: string;
}

const Hero: React.FC<HeroProps> = (props) => {
    const { t, lang } = useI18n();

    const tag = lang === 'ko' ? (props.tag_ko || t('hero_tag')) : (props.tag_en || t('hero_tag'));
    const title = lang === 'ko' ? (props.title_ko || t('hero_title')) : (props.title_en || t('hero_title'));
    const subtitle = lang === 'ko' ? (props.subtitle_ko || t('hero_subtitle')) : (props.subtitle_en || t('hero_subtitle'));

    return (
        <section className="hero" id="hero">
            <div className="container">
                <div className="hero-content">
                    <span className="hero-tag">{tag}</span>
                    <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
                    <p>{subtitle}</p>
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
