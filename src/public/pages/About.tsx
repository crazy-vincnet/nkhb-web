import React, { useState, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { getPageBySlug, CMSPage } from '../lib/cms';
import CMSPageRenderer from '../components/CMSPageRenderer';

const About: React.FC = () => {
    const { t, lang } = useI18n();
    const [pageData, setPageData] = useState<CMSPage | null>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const data = await getPageBySlug('about');
                setPageData(data);
            } catch (error) {
                console.error('Failed to fetch page data:', error);
            }
        };

        fetchPageData();
    }, []);

    const seoTitle = lang === 'ko' ? pageData?.seo_title_ko : pageData?.seo_title_en;
    const seoDescription = lang === 'ko' ? pageData?.seo_description_ko : pageData?.seo_description_en;

    return (
        <div className="about-page">
            <SEO 
                title={seoTitle || t('nav_about')}
                description={seoDescription || t('about_hero_subtitle')}
                image={pageData?.seo_image_url}
                lang={lang}
            />
            <main>
                {pageData?.layout_json ? (
                    <CMSPageRenderer layout={pageData.layout_json} />
                ) : (
                    <>
                        <section className="about-hero">
                            <div className="container">
                                <h1>{t('about_hero_title')}</h1>
                                <p className="subtitle">{t('about_hero_subtitle')}</p>
                            </div>
                        </section>

                        <section className="section about-intro">
                            <div className="container">
                                <div className="intro-top-banner">
                                    <p className="intro-top-text">{t('about_intro_top')}</p>
                                </div>
                                <div className="content-grid about-intro-grid">
                                    <div className="text-content">
                                        <h2>{t('about_intro_title')}</h2>
                                        <p>{t('about_intro_p1')}</p>
                                        <p>{t('about_intro_p2')}</p>
                                        <ul className="info-list">
                                            <li>{t('about_intro_info1')}</li>
                                            <li>{t('about_intro_info2')}</li>
                                            <li>{t('about_intro_info3')}</li>
                                        </ul>
                                    </div>
                                    <div className="image-content poster-image">
                                        <img src="/images/poster.png" alt={t('alt_poster')} loading="lazy" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section about-values">
                            <div className="container">
                                <div className="vision-box">
                                    <h2>{t('about_vision_title')}</h2>
                                    <p>{t('about_vision_desc')}</p>
                                </div>
                                <div className="mission-box">
                                    <h2>{t('about_mission_title')}</h2>
                                    <p className="mission-desc">{t('about_mission_desc')}</p>
                                    <div className="mission-grid">
                                        <div className="mission-item">{t('about_mission_li1')}</div>
                                        <div className="mission-item">{t('about_mission_li2')}</div>
                                        <div className="mission-item">{t('about_mission_li3')}</div>
                                        <div className="mission-item">{t('about_mission_li4')}</div>
                                        <div className="mission-item">{t('about_mission_li5')}</div>
                                        <div className="mission-item">{t('about_mission_li6')}</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section about-ministry">
                            <div className="container">
                                <h2 className="section-title">{t('about_ministry_title')}</h2>
                                <div className="ministry-grid">
                                    <div className="ministry-card">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="card-icon-svg">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        <h3>{t('about_ministry_card1_title')}</h3>
                                        <p>{t('about_ministry_card1_desc')}</p>
                                    </div>
                                    <div className="ministry-card">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="card-icon-svg">
                                            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                                        </svg>
                                        <h3>{t('about_ministry_card2_title')}</h3>
                                        <p>{t('about_ministry_card2_desc')}</p>
                                    </div>
                                    <div className="ministry-card">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="card-icon-svg">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                        </svg>
                                        <h3>{t('about_ministry_card3_title')}</h3>
                                        <p>{t('about_ministry_card3_desc')}</p>
                                    </div>
                                    <div className="ministry-card">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="card-icon-svg">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                        </svg>
                                        <h3>{t('about_ministry_card4_title')}</h3>
                                        <p>{t('about_ministry_card4_desc')}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section about-founder">
                            <div className="container">
                                <div className="founder-grid">
                                    <div className="founder-image">
                                        <img src="/images/kenneth-bae.png" alt={t('alt_kenneth')} loading="lazy" />
                                        <p className="caption">Kenneth Bae | NKFI 대표</p>
                                    </div>
                                    <div className="founder-info">
                                        <h2>{t('about_founder_title')}</h2>
                                        <h3 className="highlight-title">{t('about_founder_desc_title')}</h3>
                                        <ul className="profile-list">
                                            <li>{t('about_founder_profile1')}</li>
                                            <li>{t('about_founder_profile2')}</li>
                                            <li>{t('about_founder_profile3')}</li>
                                            <li>{t('about_founder_profile4')}</li>
                                            <li>{t('about_founder_profile5')}</li>
                                            <li>{t('about_founder_profile6')}</li>
                                        </ul>
                                        <p className="book-info">{t('about_founder_book')}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section about-cta">
                            <div className="container">
                                <div className="cta-box">
                                    <h2>{t('about_cta_title')}</h2>
                                    <div className="cta-buttons">
                                        <a href="http://www.newkoreafi.org" target="_blank" rel="noopener noreferrer" className="btn-fill-accent">
                                            {t('about_cta_website')}
                                        </a>
                                        <Link to="/" className="btn-outline-dark">
                                            {t('about_cta_home')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default About;