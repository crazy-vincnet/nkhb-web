import React from 'react';
import { Editable } from './Editable';

const Effects: React.FC = () => {
    return (
        <Editable k="section_effects" headless>
            {({ styles: sectionStyles }) => (
                <section className="section effects" id="effects" style={sectionStyles}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">03 — Expected Impact</span>
                            <Editable k="effects_title" headless>
                                {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                            </Editable>
                            <Editable k="effects_desc" headless>
                                {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>
                        </div>

                        <div className="effects-grid">
                            {[1, 2, 3, 4, 5].map(num => (
                                <div className="effect-card" key={num}>
                                    <span className="effect-num">{String(num).padStart(2, '0')}</span>
                                    <Editable k={`effects_card${num}_title`} headless>
                                        {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                                    </Editable>
                                    <Editable k={`effects_card${num}_desc`} headless>
                                        {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
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

export default Effects;
