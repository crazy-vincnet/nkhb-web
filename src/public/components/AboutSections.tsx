import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { Editable } from './Editable';

export const AboutHero: React.FC = () => {
    return (
        <Editable k="section_about_hero" headless>
            {({ styles: s1 }) => (
                <section className="about-hero" style={s1 || {}}>
                    <div className="container">
                        <div className="about-hero-content">
                            <Editable k="about_hero_title" headless>
                                {({ text, styles }) => <h1 style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h1>}
                            </Editable>
                            <Editable k="about_hero_subtitle" headless>
                                {({ text, styles }) => <p className="subtitle" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                            </Editable>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};

export const AboutIntro: React.FC = () => {
    return (
        <Editable k="section_about_intro" headless>
            {({ styles: s2, items: items2 }) => (
                <section className="section about-intro" style={s2 || {}}>
                    <div className="container">
                        <div className="intro-top-banner">
                            <Editable k="about_intro_top" headless>
                                {({ text, styles }) => <p className="intro-top-text" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                            </Editable>
                        </div>
                        <div className="about-intro-grid">
                            <div className="text-content">
                                <Editable k="about_intro_title" headless>
                                    {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h2>}
                                </Editable>
                                <Editable k="about_intro_p1" headless>
                                    {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                                </Editable>
                                <Editable k="about_intro_p2" headless>
                                    {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                                </Editable>
                                <ul className="info-list">
                                    {(items2 || [1, 2, 3]).map((i: number) => (
                                        <Editable k={`about_intro_info${i}`} key={`intro-info-${i}`} headless>
                                            {({ text, styles }) => <li style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></li>}
                                        </Editable>
                                    ))}
                                </ul>
                            </div>
                            <div className="image-content poster-image">
                                <Editable k="image_about_poster" headless>
                                    {({ link, styles }) => (
                                        <div style={styles || {}}>
                                            <img src={link || '/images/poster.png'} alt="poster" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        </div>
                                    )}
                                </Editable>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};

export const AboutVision: React.FC = () => {
    return (
        <Editable k="section_about_vision" headless>
            {({ styles: s3, items: items3 }) => (
                <section className="section about-vision bg-alt" style={s3 || {}}>
                    <div className="container">
                        <div className="vision-box">
                            <Editable k="about_vision_title" headless>
                                {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h3>}
                            </Editable>
                            <Editable k="about_vision_desc" headless>
                                {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                            </Editable>
                        </div>
                        
                        <div className="mission-box">
                            <Editable k="about_mission_title" headless>
                                {({ text, styles }) => <h3 className="section-title text-center" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h3>}
                            </Editable>
                            <Editable k="about_mission_desc" headless>
                                {({ text, styles }) => <p className="mission-desc text-center" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                            </Editable>
                            <div className="mission-grid">
                                {(items3 || [1, 2, 3, 4, 5, 6]).map((i: number) => (
                                    <Editable k={`about_mission_li${i}`} key={`mission-item-${i}`} className="mission-item" headless>
                                        {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></span>}
                                    </Editable>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};

export const AboutMinistry: React.FC = () => {
    return (
        <Editable k="section_about_ministry" headless>
            {({ styles: s4, items: items4 }) => (
                <section className="section about-ministry" style={s4 || {}}>
                    <div className="container">
                        <Editable k="about_ministry_title" headless>
                            {({ text, styles }) => <h2 className="section-title text-center" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h2>}
                        </Editable>
                        <div className="ministry-grid">
                            {(items4 || [1, 2, 3, 4]).map((i: number) => (
                                <div className="ministry-card" key={`ministry-card-${i}`}>
                                    <div className="card-icon-svg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', fontSize: '2.5rem' }}>
                                        {i === 1 ? '📢' : i === 2 ? '📖' : i === 3 ? '🤝' : '🆘'}
                                    </div>
                                    <Editable k={`about_ministry_card${i}_title`} headless>
                                        {({ text, styles }) => <h4 style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h4>}
                                    </Editable>
                                    <Editable k={`about_ministry_card${i}_desc`} headless>
                                        {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                                    </Editable>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};

export const AboutFounder: React.FC = () => {
    const { lang } = useI18n();
    return (
        <Editable k="section_about_founder" headless>
            {({ styles: s5, items: items5 }) => (
                <section className="section about-founder" style={s5 || {}}>
                    <div className="container">
                        <div className="founder-grid">
                            <div className="founder-image">
                                <Editable k="image_about_kenneth" headless>
                                    {({ link, styles }) => (
                                        <div style={styles || {}}>
                                            <img src={link || '/images/kenneth-bae.png'} alt="Kenneth Bae" loading="lazy" />
                                        </div>
                                    )}
                                </Editable>
                                <p className="caption">{lang === 'en' ? 'Kenneth Bae | President, NKFI' : '케네스 배 (Kenneth Bae) | NKFI 대표'}</p>
                            </div>
                            <div className="founder-info">
                                <Editable k="about_founder_title" headless>
                                    {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h2>}
                                </Editable>
                                <Editable k="about_founder_desc_title" headless>
                                    {({ text, styles }) => <h3 className="highlight-title" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h3>}
                                </Editable>
                                <ul className="profile-list">
                                    {(items5 || [1, 2, 3, 4, 5, 6]).map((i: number) => (
                                        <Editable k={`about_founder_profile${i}`} key={`profile-item-${i}`} headless>
                                            {({ text, styles }) => <li style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></li>}
                                        </Editable>
                                    ))}
                                </ul>
                                <Editable k="about_founder_book" headless>
                                    {({ text, styles }) => <p className="book-info" style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></p>}
                                </Editable>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};

export const AboutCTA: React.FC = () => {
    return (
        <Editable k="section_about_cta" headless>
            {({ styles: s6 }) => (
                <section className="section about-cta" style={s6 || {}}>
                    <div className="container">
                        <div className="cta-box text-center">
                            <Editable k="about_cta_title" headless>
                                {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text || '' }}></h2>}
                            </Editable>
                            <div className="cta-buttons">
                                <Editable k="about_cta_website" headless>
                                    {({ text, styles, link }) => (
                                        <a href={link || "https://nkfi.org"} target="_blank" rel="noopener noreferrer" className="btn-hero btn-fill-accent" style={styles || {}} dangerouslySetInnerHTML={{ __html: text || '' }}>
                                        </a>
                                    )}
                                </Editable>
                                <Editable k="about_cta_home" headless>
                                    {({ text, styles, link }) => (
                                        <Link to={link || "/"} className="btn-outline-dark" style={styles || {}} dangerouslySetInnerHTML={{ __html: text || '' }}>
                                        </Link>
                                    )}
                                </Editable>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};
