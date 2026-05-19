import React, { memo } from 'react';
import { Editable } from './Editable';

interface CompositionProps {
    onOpenSample: () => void;
}

// ⚡ Bolt: Wrapped with React.memo to prevent re-renders when parent state changes
const Composition: React.FC<CompositionProps> = memo(({ onOpenSample }) => {
    return (
        <Editable k="section_composition" headless>
            {({ styles: sectionStyles }) => (
                <section className="section composition" id="composition" style={sectionStyles}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">02 — Program Structure</span>
                            <Editable k="composition_title" headless>
                                {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                            </Editable>
                            <Editable k="composition_desc" headless>
                                {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>
                        </div>

                        <div className="theme-grid">
                            {[1, 2, 3, 4].map(num => (
                                <div className="theme-card" key={num}>
                                    <div className="card-num">{num}</div>
                                    <Editable k={`composition_card${num}_title`} headless>
                                        {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                                    </Editable>
                                    <Editable k={`composition_card${num}_desc`} headless>
                                        {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                    </Editable>
                                </div>
                            ))}
                        </div>

                        <div className="composition-action">
                            <Editable k="composition_button_sample" headless>
                                {({ text, styles }) => (
                                    <button className="btn-sample-wide" style={styles} onClick={onOpenSample} dangerouslySetInnerHTML={{ __html: text }}>
                                    </button>
                                )}
                            </Editable>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
});

Composition.displayName = 'Composition';

export default Composition;
