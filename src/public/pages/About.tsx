import React from 'react';
import { useI18n } from '../lib/i18n';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const About: React.FC = () => {
    const { t } = useI18n();

    return (
        <div className="about-page">
            <SEO slug="about" />
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <h1>{t('about_hero_title')}</h1>
                        <p>{t('about_hero_subtitle')}</p>
                    </div>
                </div>
            </section>

            <main className="about-content">
                <section className="section about-intro">
                    <div className="container">
                        <p className="intro-top">{t('about_intro_top')}</p>
                        <div className="about-intro-grid">
                            <div className="text-content">
                                <h2>{t('about_intro_title')}</h2>
                                <p className="description">{t('about_intro_p1')}</p>
                                <p className="description">{t('about_intro_p2')}</p>
                                <ul className="info-list">
                                    <li>{t('about_intro_info1')}</li>
                                    <li>{t('about_intro_info2')}</li>
                                    <li>{t('about_intro_info3')}</li>
                                </ul>
                            </div>
                            <div className="image-content poster-image">
                                <img src={t('image_about_poster')} alt={t('alt_poster')} loading="lazy" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-vision bg-alt">
                    <div className="container">
                        <div className="vision-grid">
                            <div className="vision-card">
                                <h3>{t('about_vision_title')}</h3>
                                <p>{t('about_vision_desc')}</p>
                            </div>
                            <div className="mission-card">
                                <h3>{t('about_mission_title')}</h3>
                                <p className="mission-desc">{t('about_mission_desc')}</p>
                                <ul className="mission-list">
                                    <li>{t('about_mission_li1')}</li>
                                    <li>{t('about_mission_li2')}</li>
                                    <li>{t('about_mission_li3')}</li>
                                    <li>{t('about_mission_li4')}</li>
                                    <li>{t('about_mission_li5')}</li>
                                    <li>{t('about_mission_li6')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-ministry">
                    <div className="container">
                        <h2 className="section-title">{t('about_ministry_title')}</h2>
                        <div className="ministry-grid">
                            <div className="ministry-card">
                                <div className="card-icon">📢</div>
                                <h4>{t('about_ministry_card1_title')}</h4>
                                <p>{t('about_ministry_card1_desc')}</p>
                            </div>
                            <div className="ministry-card">
                                <div className="card-icon">📖</div>
                                <h4>{t('about_ministry_card2_title')}</h4>
                                <p>{t('about_ministry_card2_desc')}</p>
                            </div>
                            <div className="ministry-card">
                                <div className="card-icon">🤝</div>
                                <h4>{t('about_ministry_card3_title')}</h4>
                                <p>{t('about_ministry_card3_desc')}</p>
                            </div>
                            <div className="ministry-card">
                                <div className="card-icon">🆘</div>
                                <h4>{t('about_ministry_card4_title')}</h4>
                                <p>{t('about_ministry_card4_desc')}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-founder">
                    <div className="container">
                        <div className="founder-grid">
                            <div className="founder-image">
                                <img src={t('image_about_kenneth')} alt={t('alt_kenneth')} loading="lazy" />
                                <p className="caption">Kenneth Bae | NKFI 대표</p>
                            </div>
                            <div className="founder-info">
                                <h2>{t('about_founder_title')}</h2>
                                <h3 className="highlight-title">{t('about_founder_desc_title')}</h3>
                                <div className="profile-list">
                                    <p>{t('about_founder_profile1')}</p>
                                    <p>{t('about_founder_profile2')}</p>
                                    <p>{t('about_founder_profile3')}</p>
                                    <p>{t('about_founder_profile4')}</p>
                                    <p>{t('about_founder_profile5')}</p>
                                    <p>{t('about_founder_profile6')}</p>
                                    <p className="book-info font-bold">{t('about_founder_book')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-cta bg-primary">
                    <div className="container">
                        <div className="cta-box">
                            <h2>{t('about_cta_title')}</h2>
                            <div className="cta-buttons">
                                <a href="https://nkfi.org" target="_blank" rel="noopener noreferrer" className="btn-hero">
                                    {t('about_cta_website')}
                                </a>
                                <Link to="/" className="btn-hero btn-outline">
                                    {t('about_cta_home')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;
