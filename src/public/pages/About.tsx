import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Editable } from '../components/Editable';

const About: React.FC = () => {
    return (
        <div className="about-page">
            <SEO slug="about" />
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <Editable k="about_hero_title">
                            {({ text, styles }) => <h1 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h1>}
                        </Editable>
                        <Editable k="about_hero_subtitle">
                            {({ text, styles }) => <p className="subtitle" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                        </Editable>
                    </div>
                </div>
            </section>

            <main className="about-content">
                <section className="section about-intro">
                    <div className="container">
                        <div className="intro-top-banner">
                            <Editable k="about_intro_top">
                                {({ text, styles }) => <p className="intro-top-text" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>
                        </div>
                        <div className="about-intro-grid">
                            <div className="text-content">
                                <Editable k="about_intro_title">
                                    {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                                </Editable>
                                <Editable k="about_intro_p1">
                                    {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>
                                <Editable k="about_intro_p2">
                                    {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>
                                <ul className="info-list">
                                    <Editable k="about_intro_info1" as="li">
                                        {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                    </Editable>
                                    <Editable k="about_intro_info2" as="li">
                                        {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                    </Editable>
                                    <Editable k="about_intro_info3" as="li">
                                        {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                    </Editable>
                                </ul>
                            </div>
                            <div className="image-content poster-image">
                                <Editable k="image_about_poster">
                                    {({ link, styles }) => (
                                        <div style={styles}>
                                            <img src={link} alt="poster" loading="lazy" />
                                        </div>
                                    )}
                                </Editable>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-vision bg-alt">
                    <div className="container">
                        <div className="vision-box">
                            <Editable k="about_vision_title">
                                {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                            </Editable>
                            <Editable k="about_vision_desc">
                                {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>
                        </div>
                        
                        <div className="mission-box">
                            <Editable k="about_mission_title">
                                {({ text, styles }) => <h3 className="section-title text-center" style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                            </Editable>
                            <Editable k="about_mission_desc">
                                {({ text, styles }) => <p className="mission-desc text-center" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>
                            <div className="mission-grid">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Editable k={`about_mission_li${i}`} key={i} className="mission-item">
                                        {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                    </Editable>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-ministry">
                    <div className="container">
                        <Editable k="about_ministry_title" headless>
                            {({ text, styles }) => <h2 className="section-title text-center" style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                        </Editable>
                        <div className="ministry-grid">
                            {[1, 2, 3, 4].map((i) => (
                                <div className="ministry-card" key={i}>
                                    <div className="card-icon-svg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                                        {i === 1 ? '📢' : i === 2 ? '📖' : i === 3 ? '🤝' : '🆘'}
                                    </div>
                                    <Editable k={`about_ministry_card${i}_title`} headless>
                                        {({ text, styles }) => <h4 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h4>}
                                    </Editable>
                                    <Editable k={`about_ministry_card${i}_desc`} headless>
                                        {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                    </Editable>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section about-founder">
                    <div className="container">
                        <div className="founder-grid">
                            <div className="founder-image">
                                <Editable k="image_about_kenneth">
                                    {({ link, styles }) => (
                                        <div style={styles}>
                                            <img src={link} alt="Kenneth Bae" loading="lazy" />
                                        </div>
                                    )}
                                </Editable>
                                <p className="caption">Kenneth Bae | NKFI 대표</p>
                            </div>
                            <div className="founder-info">
                                <Editable k="about_founder_title">
                                    {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                                </Editable>
                                <Editable k="about_founder_desc_title">
                                    {({ text, styles }) => <h3 className="highlight-title" style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                                </Editable>
                                <ul className="profile-list">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <Editable k={`about_founder_profile${i}`} key={i} as="li">
                                            {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                        </Editable>
                                    ))}
                                </ul>
                                <Editable k="about_founder_book">
                                    {({ text, styles }) => <p className="book-info" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section about-cta">
                    <div className="container">
                        <div className="cta-box text-center">
                            <Editable k="about_cta_title">
                                {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                            </Editable>
                            <div className="cta-buttons">
                                <Editable k="about_cta_website" className="inline-block">
                                    {({ text, styles, link }) => (
                                        <a href={link || "https://nkfi.org"} target="_blank" rel="noopener noreferrer" className="btn-hero btn-fill-accent" style={styles} dangerouslySetInnerHTML={{ __html: text }}>
                                        </a>
                                    )}
                                </Editable>
                                <Editable k="about_cta_home" className="inline-block ml-4">
                                    {({ text, styles, link }) => (
                                        <Link to={link || "/"} className="btn-outline-dark" style={styles} dangerouslySetInnerHTML={{ __html: text }}>
                                        </Link>
                                    )}
                                </Editable>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default About;
