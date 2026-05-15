import React from 'react';
import { Editable } from './Editable';

interface CompositionProps {
    onOpenSample: () => void;
}

const Composition: React.FC<CompositionProps> = ({ onOpenSample }) => {
    return (
        <section className="section composition" id="composition">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">02 — Program Structure</span>
                    <Editable k="composition_title">
                        {({ text, styles }) => <h2 style={styles}>{text}</h2>}
                    </Editable>
                    <Editable k="composition_desc">
                        {({ text, styles }) => <p className="description" style={styles}>{text}</p>}
                    </Editable>
                </div>

                <div className="theme-grid">
                    {[1, 2, 3, 4].map(num => (
                        <div className="theme-card" key={num}>
                            <div className="card-num">{num}</div>
                            <Editable k={`composition_card${num}_title`}>
                                {({ text, styles }) => <h3 style={styles}>{text}</h3>}
                            </Editable>
                            <Editable k={`composition_card${num}_desc`}>
                                {({ text, styles }) => <p style={styles}>{text}</p>}
                            </Editable>
                        </div>
                    ))}
                </div>

                <div className="composition-action">
                    <Editable k="composition_button_sample">
                        {({ text, styles }) => (
                            <button className="btn-sample-wide" style={styles} onClick={onOpenSample}>
                                {text}
                            </button>
                        )}
                    </Editable>
                </div>
            </div>
        </section>
    );
};

export default Composition;
