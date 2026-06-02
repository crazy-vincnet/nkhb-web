import React from 'react';
import { Editable } from './Editable';

const Reach: React.FC = () => {
    return (
        <Editable k="section_reach" headless>
            {({ styles: sectionStyles, items }) => (
                <section className="section reach" id="reach" style={sectionStyles}>
                    <div className="container">
                        <div className="reach-grid">
                            <div className="reach-visual">
                                <Editable k="image_reach_map" headless>
                                    {({ link, styles }) => (
                                        <div className="map-container" style={styles}>
                                            <img src={link} alt="map" className="map-bg" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                            <div className="pulse-ring"></div>
                                            <div className="pulse-ring delay-1"></div>
                                            <div className="pulse-ring delay-2"></div>
                                        </div>
                                    )}
                                </Editable>
                            </div>

                            <div className="reach-text">
                                <Editable k="reach_tag" headless>
                                    {({ text, styles }) => <span className="section-tag" style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                </Editable>
                                <Editable k="reach_title" headless>
                                    {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                                </Editable>
                                <Editable k="reach_desc" headless>
                                    {({ text, styles }) => <p className="description" style={styles}>{text}</p>}
                                </Editable>
                                <div className="reach-details">
                                    <Editable k="reach_details1" headless>
                                        {({ text, styles }) => <p style={styles}>{text}</p>}
                                    </Editable>
                                    <Editable k="reach_details2" headless>
                                        {({ text, styles }) => <p className="highlight" style={styles}>{text}</p>}
                                    </Editable>
                                </div>
                                <div className="reach-features">
                                    {(items || [1, 2, 3]).map((id: number) => (
                                        <div className="feature-item" key={id}>
                                            <span className="dot"></span>
                                            <Editable k={`reach_feature${id}`} headless>
                                                {({ text, styles }) => <p style={styles}>{text}</p>}
                                            </Editable>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};

export default Reach;
