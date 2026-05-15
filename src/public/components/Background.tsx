import React from 'react';
import { Link } from 'react-router-dom';
import { Editable } from './Editable';

interface BackgroundProps {
    onOpenArticle: () => void;
}

const Background: React.FC<BackgroundProps> = ({ onOpenArticle }) => {
    return (
        <section className="section background" id="background">
            <div className="container">
                <div className="content-grid">
                    <div className="text-content">
                        <span className="section-tag">01 — Background</span>
                        
                        <Editable k="background_title">
                            {({ text, styles }) => <h2 style={styles}>{text}</h2>}
                        </Editable>

                        <Editable k="background_desc1">
                            {({ text, styles }) => <p className="description" style={styles}>{text}</p>}
                        </Editable>

                        <div className="founder-story">
                            <Editable k="background_quote">
                                {({ text, styles }) => <p className="quote" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>
                        </div>

                        <Editable k="background_desc2">
                            {({ text, styles }) => <p className="description" style={styles}>{text}</p>}
                        </Editable>

                        <Editable k="background_desc3">
                            {({ text, styles }) => <p className="description sub-desc" style={styles}>{text}</p>}
                        </Editable>

                        <div className="action-area">
                            <Editable k="background_about_nkfi" className="inline-block">
                                {({ text, styles, link }) => (
                                    <Link to={link || "/about"} className="btn-hero btn-outline" style={styles}>{text}</Link>
                                )}
                            </Editable>
                            
                            <Editable k="background_read_more" className="inline-block ml-4">
                                {({ text, styles }) => (
                                    <button className="btn-hero btn-outline" style={styles} onClick={onOpenArticle}>
                                        {text}
                                    </button>
                                )}
                            </Editable>
                        </div>
                    </div>
                    
                    <div className="image-content">
                        <Editable k="image_background_section">
                            {({ link, styles }) => (
                                <div className="image-placeholder" style={styles}>
                                    <img src={link} alt="background" loading="lazy" />
                                </div>
                            )}
                        </Editable>
                        
                        <div className="testimonial-box">
                            <Editable k="background_testimonial_tag">
                                {({ text, styles }) => <span className="testimonial-tag" style={styles}>{text}</span>}
                            </Editable>
                            <Editable k="background_testimonial_text">
                                {({ text, styles }) => <p className="testimonial-text" style={styles}>{text}</p>}
                            </Editable>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Background;
