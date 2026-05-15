import React from 'react';
import { Link } from 'react-router-dom';
import { Editable } from './Editable';

const Hero: React.FC = () => {
    return (
        <Editable k="section_hero" headless>
            {({ styles: sMain, link: lMain }) => (
                <section 
                    className="hero" 
                    id="hero"
                    style={{ 
                        background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('${lMain || '/images/main-hero.png'}') center/cover no-repeat`,
                        ...sMain 
                    }}
                >
                    <div className="container">
                        <div className="hero-content">
                            <Editable k="hero_tag" headless>
                                {({ text, styles: s }) => <span className="hero-tag" style={s} dangerouslySetInnerHTML={{ __html: text }}></span>}
                            </Editable>
                            
                            <Editable k="hero_title" headless>
                                {({ text, styles: s }) => <h1 style={s} dangerouslySetInnerHTML={{ __html: text }}></h1>}
                            </Editable>

                            <Editable k="hero_subtitle" headless>
                                {({ text, styles: s }) => <p style={s} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>

                            <div className="hero-btns">
                                <Editable k="hero_button_about" headless>
                                    {({ text, styles: s, link: l }) => (
                                        <Link to={l || "/#background"} className="btn-hero btn-fill" style={s} dangerouslySetInnerHTML={{ __html: text }}></Link>
                                    )}
                                </Editable>
                                
                                <Editable k="hero_button_letter" headless>
                                    {({ text, styles: s, link: l }) => (
                                        <Link to={l || "/#guide"} className="btn-hero btn-outline ml-4" style={s} dangerouslySetInnerHTML={{ __html: text }}></Link>
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
