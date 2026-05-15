import React from 'react';
import { Link } from 'react-router-dom';
import { Editable } from './Editable';

const Hero: React.FC = () => {
    return (
        <Editable k="image_hero_bg">
            {({ styles, link }) => (
                <section 
                    className="hero" 
                    id="hero"
                    style={{ 
                        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('${link}') center/cover no-repeat`,
                        ...styles 
                    }}
                >
                    <div className="container">
                        <div className="hero-content">
                            <Editable k="hero_tag">
                                {({ text, styles: s }) => <span className="hero-tag" style={s}>{text}</span>}
                            </Editable>
                            
                            <Editable k="hero_title">
                                {({ text, styles: s }) => <h1 style={s} dangerouslySetInnerHTML={{ __html: text }}></h1>}
                            </Editable>

                            <Editable k="hero_subtitle">
                                {({ text, styles: s }) => <p style={s}>{text}</p>}
                            </Editable>

                            <div className="hero-btns">
                                <Editable k="hero_button_about" className="inline-block">
                                    {({ text, styles: s, link: l }) => (
                                        <Link to={l || "/#background"} className="btn-hero btn-fill" style={s}>{text}</Link>
                                    )}
                                </Editable>
                                
                                <Editable k="hero_button_letter" className="inline-block ml-4">
                                    {({ text, styles: s, link: l }) => (
                                        <Link to={l || "/#guide"} className="btn-hero btn-outline" style={s}>{text}</Link>
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

export default Hero;
