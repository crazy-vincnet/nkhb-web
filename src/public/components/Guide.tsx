import React from 'react';
import { useI18n } from '../lib/i18n';

interface GuideProps {
    onOpenLetter: () => void;
}

const Guide: React.FC<GuideProps> = ({ onOpenLetter }) => {
    const { t } = useI18n();

    return (
        <section className="section guide" id="guide">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">05 — Get Involved</span>
                    <h2>{t('guide_title')}</h2>
                    <p className="description" dangerouslySetInnerHTML={{ __html: t('guide_desc') }}></p>
                </div>

                <div className="participation-sub-section">
                    <h3>{t('guide_letter_title')}</h3>

                    <div className="trust-card">
                        <div className="card-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="2"></circle>
                                <path
                                    d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14">
                                </path>
                            </svg>
                        </div>
                        <div className="card-body">
                            <p className="intro-text" dangerouslySetInnerHTML={{ __html: t('guide_letter_intro') }}></p>
                            <div className="card-divider"></div>
                            <p className="notice-text" dangerouslySetInnerHTML={{ __html: t('guide_letter_notice') }}></p>
                        </div>
                    </div>

                    <div className="guide-steps">
                        <div className="step-card">
                            <div className="step-num">STEP 01</div>
                            <h4>{t('guide_step1_title')}</h4>
                            <p>{t('guide_step1_desc')}</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">STEP 02</div>
                            <h4>{t('guide_step2_title')}</h4>
                            <p>{t('guide_step2_desc')}</p>
                        </div>
                        <div className="step-card">
                            <div className="step-num">STEP 03</div>
                            <h4>{t('guide_step3_title')}</h4>
                            <p>{t('guide_step3_desc')}</p>
                        </div>
                    </div>
                    <div className="contact-box">
                        <p className="contact-title">{t('guide_contact_title')}</p>
                        <a href="mailto:nkhb316@gmail.com" className="contact-email">nkhb316@gmail.com</a>

                        <div className="contact-actions">
                            <button 
                                id="open-letter-modal" 
                                className="btn-fill-accent"
                                onClick={onOpenLetter}
                            >
                                {t('guide_button_write')}
                            </button>
                        </div>

                        <div className="writing-guide">
                            <h4>{t('guide_writing_title')}</h4>
                            <ul className="guide-list">
                                <li dangerouslySetInnerHTML={{ __html: t('guide_writing_li1') }}></li>
                                <li dangerouslySetInnerHTML={{ __html: t('guide_writing_li2') }}></li>
                                <li dangerouslySetInnerHTML={{ __html: t('guide_writing_li3') }}></li>
                                <li dangerouslySetInnerHTML={{ __html: t('guide_writing_li4') }}></li>
                            </ul>
                        </div>

                        <p className="contact-note">{t('guide_contact_note')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Performance: Export memoized component to skip re-renders when props haven't changed
export default React.memo(Guide);
