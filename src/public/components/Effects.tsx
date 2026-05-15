import React from 'react';
import { Editable } from './Editable';

const Effects: React.FC = () => {
    return (
        <section className="section effects" id="effects">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">03 — Expected Impact</span>
                    <Editable k="effects_title">
                        {({ text, styles }) => <h2 style={styles}>{text}</h2>}
                    </Editable>
                    <Editable k="effects_desc">
                        {({ text, styles }) => <p className="description" style={styles}>{text}</p>}
                    </Editable>
                </div>

                <div className="effects-grid">
                    {[1, 2, 3, 4, 5].map(num => (
                        <div className="effect-card" key={num}>
                            <span className="effect-num">{String(num).padStart(2, '0')}</span>
                            <Editable k={`effects_card${num}_title`}>
                                {({ text, styles }) => <h3 style={styles}>{text}</h3>}
                            </Editable>
                            <Editable k={`effects_card${num}_desc`}>
                                {({ text, styles }) => <p style={styles}>{text}</p>}
                            </Editable>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Effects;
