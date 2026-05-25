import React from 'react';
import { Editable } from './Editable';

interface GuideProps {
    onOpenLetter: () => void;
}

const Guide: React.FC<GuideProps> = ({ onOpenLetter }) => {
    return (
        <Editable k="section_guide" headless>
            {({ styles: sectionStyles }) => (
                <section className="section guide" id="guide" style={sectionStyles}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-tag">05 — Get Involved</span>
                            <Editable k="guide_title" headless>
                                {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                            </Editable>
                            <Editable k="guide_desc" headless>
                                {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                            </Editable>
                        </div>

                        <div className="participation-sub-section">
                            <Editable k="guide_letter_title" headless>
                                {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                            </Editable>

                            <div className="trust-card">
                                <div className="card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
                                </div>
                                <div className="card-body">
                                    <Editable k="guide_letter_intro" headless>
                                        {({ text, styles }) => <p className="intro-text" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                    </Editable>
                                    <div className="card-divider"></div>
                                    <Editable k="guide_letter_notice" headless>
                                        {({ text, styles }) => <p className="notice-text" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                    </Editable>
                                </div>
                            </div>

                            <div className="guide-steps">
                                {((sectionStyles as any).items || [1, 2, 3]).map((id: number) => (
                                    <div className="step-card" key={id}>
                                        <div className="step-num">STEP 0{id}</div>
                                        <Editable k={`guide_step${id}_title`} headless>
                                            {({ text, styles }) => <h4 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h4>}
                                        </Editable>
                                        <Editable k={`guide_step${id}_desc`} headless>
                                            {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                        </Editable>
                                    </div>
                                ))}
                            </div>
                            <div className="contact-box">
                                <Editable k="guide_contact_title" headless>
                                    {({ text, styles }) => <p className="contact-title" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>
                                <a href="mailto:nkhb316@gmail.com" className="contact-email">nkhb316@gmail.com</a>

                                <div className="contact-actions">
                                    <Editable k="guide_button_write" headless>
                                        {({ text, styles }) => (
                                            <button className="btn-fill-accent" style={styles} onClick={onOpenLetter} dangerouslySetInnerHTML={{ __html: text }}>
                                            </button>
                                        )}
                                    </Editable>
                                </div>

                                <div className="writing-guide">
                                    <Editable k="guide_writing_title" headless>
                                        {({ text, styles }) => <h4 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h4>}
                                    </Editable>
                                    <ul className="guide-list">
                                        {[1, 2, 3, 4].map(num => (
                                            <Editable k={`guide_writing_li${num}`} key={num} as="li" headless>
                                                {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                            </Editable>
                                        ))}
                                    </ul>
                                </div>

                                <Editable k="guide_contact_note" headless>
                                    {({ text, styles }) => <p className="contact-note" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                                </Editable>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Editable>
    );
};

export default Guide;
