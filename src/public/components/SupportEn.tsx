import React from 'react';
import { useI18n } from '../lib/i18n';

const SupportEn: React.FC = () => {
    const { t } = useI18n();

    return (
        <section className="section support-en" id="support">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">06 — Support</span>
                    <h2>{t('support_en_title')}</h2>
                    <p className="description">Become a radio-wave missionary bringing truth and hope to the people of North Korea.</p>
                </div>

                <div className="participation-sub-section" id="support-en-sub">
                    <p className="sub-description">If 1,000 radio-wave missionaries each give $1 a day — $30 a month — we can produce and broadcast two hours of programming every day, carrying hope across all of North Korea.</p>
                </div>

                <div className="impact-info-container">
                    <div className="impact-box">
                        <h3>🙌 Your prayers and support</h3>
                        <ul>
                            <li>Produce broadcasts that bring the gospel and hope to North Koreans</li>
                            <li>Sustain reliable shortwave radio transmission</li>
                            <li>Create content made for the people of North Korea</li>
                        </ul>
                    </div>
                    <div className="impact-box">
                        <h3>✨ For the people of North Korea</h3>
                        <ul>
                            <li>A new window to the outside world</li>
                            <li>A message of hope that sustains their lives</li>
                            <li>The light of the gospel shining through the darkness</li>
                        </ul>
                    </div>
                </div>

                <div className="support-en-grid">
                    <div className="support-en-card">
                        <h3>Donation from USA</h3>
                        <p><strong>Send checks to:</strong><br />New Korea Foundation International (NKFI)<br />4048
                            Lakeland Ave. N #22171<br />Minneapolis, MN 55422</p>
                        <p><strong>Zelle / PayPal:</strong><br /><a
                            href="mailto:giving@newkoreafi.org">giving@newkoreafi.org</a></p>
                    </div>
                    <div className="support-en-card">
                        <h3>International Transfer</h3>
                        <p><strong>Bank:</strong> KEB Hana Bank<br /><strong>Account:</strong>
                            164-890042-65438<br /><strong>Recipient:</strong> New Korea Foundation
                            International<br /><strong>SWIFT BIC:</strong> KOEXKRSE</p>
                        <p><strong>Bank Branch:</strong> Sinjeong-dong Bank<br /><strong>Tel:</strong> +82-2-2646-1111</p>
                    </div>
                </div>
                <div className="support-en-cta">
                    <a href="https://www.paypal.com/donate/?hosted_button_id=C63Y87MR7F4FL" className="btn-paypal"
                        target="_blank" rel="noopener noreferrer">Donate via PayPal</a>
                </div>
            </div>
        </section>
    );
};

export default SupportEn;
