import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Editable } from './Editable';

interface BackgroundProps {
    onOpenArticle: () => void;
}

const YOUTUBE_VIDEO_ID = 'GSmBL-TYauE';

const Background = React.memo(({ onOpenArticle }: BackgroundProps) => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return (
        <Editable k="section_background" headless>
            {({ styles: sectionStyles }) => (
                <section className="section background" id="background" style={sectionStyles}>
                    <div className="container">
                        <div className="content-grid">
                            <div className="text-content">
                                <Editable k="background_tag" headless>
                                    {({ text, styles }) => <span className="section-tag" style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                </Editable>
                                
                                <Editable k="background_title" headless>
                                    {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                                </Editable>

                                <Editable k="background_desc1" headless>
                                    {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>

                                <div className="founder-story">
                                    <Editable k="background_quote" headless>
                                        {({ text, styles }) => <p className="quote" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                    </Editable>
                                </div>

                                <Editable k="background_desc2" headless>
                                    {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>

                                <Editable k="background_desc3" headless>
                                    {({ text, styles }) => <p className="description sub-desc" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>

                                <div className="action-area">
                                    <Editable k="background_about_nkfi" headless>
                                        {({ text, styles, link }) => (
                                            <Link to={link || "/about"} className="btn-hero btn-outline" style={styles} dangerouslySetInnerHTML={{ __html: text }}></Link>
                                        )}
                                    </Editable>
                                    
                                    <Editable k="background_read_more" headless>
                                        {({ text, styles }) => (
                                            <button className="btn-hero btn-outline" style={styles} onClick={onOpenArticle} dangerouslySetInnerHTML={{ __html: text }}>
                                            </button>
                                        )}
                                    </Editable>
                                </div>
                            </div>
                            
                            <div className="image-content">
                                <div className="image-placeholder" style={{ aspectRatio: '16 / 9' }}>
                                    {prefersReducedMotion ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                                            alt=""
                                            style={{ width: '100%', height: '100%', border: 0, display: 'block', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&playsinline=1&rel=0&modestbranding=1`}
                                            title="New Korea Hope Broadcasting"
                                            loading="lazy"
                                            style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
                                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                                
                                <div className="testimonial-box">
                                    <Editable k="background_testimonial_tag" headless>
                                        {({ text, styles }) => <span className="testimonial-tag" style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                    </Editable>
                                    <Editable k="background_testimonial_text" headless>
                                        {({ text, styles }) => <p className="testimonial-text" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                    </Editable>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
});

export default Background;
