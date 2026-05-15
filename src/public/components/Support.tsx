import React from 'react';
import { Editable } from './Editable';

const Support: React.FC = () => {
    return (
        <section className="section support" id="support">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">06 — Support</span>
                    <Editable k="support_title">
                        {({ text, styles }) => <h2 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h2>}
                    </Editable>
                    <Editable k="support_desc">
                        {({ text, styles }) => <p className="description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                    </Editable>
                </div>

                <div className="participation-sub-section" id="support-sub">
                    <Editable k="support_appeal_desc">
                        {({ text, styles }) => <p className="sub-description" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                    </Editable>
                </div>

                <div className="impact-info-container">
                    <div className="impact-box">
                        <Editable k="support_impact1_title">
                            {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                        </Editable>
                        <ul>
                            <Editable k="support_impact1_li1" as="li">
                                {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                            </Editable>
                            <Editable k="support_impact1_li2" as="li">
                                {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                            </Editable>
                            <Editable k="support_impact1_li3" as="li">
                                {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                            </Editable>
                        </ul>
                    </div>
                    <div className="impact-box">
                        <Editable k="support_impact2_title">
                            {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                        </Editable>
                        <ul>
                            <Editable k="support_impact2_li1" as="li">
                                {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                            </Editable>
                            <Editable k="support_impact2_li2" as="li">
                                {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                            </Editable>
                            <Editable k="support_impact2_li3" as="li">
                                {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                            </Editable>
                        </ul>
                    </div>
                </div>

                <div className="support-boxes-container">
                    <div className="production-support">
                        <Editable k="support_regular_title">
                            {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                        </Editable>
                        <div className="tier-buttons">
                            {['30k', '50k', '100k', '200k', '300k', '500k', '1m'].map((tier) => (
                                <Editable k={`support_regular_${tier}`} key={tier} headless>
                                    {({ text, styles, link }) => (
                                        <a href={link || "#"} className={`tier-btn ${tier === '30k' ? 'tier-btn-main' : ''}`} style={styles} target="_blank" rel="noopener noreferrer" dangerouslySetInnerHTML={{ __html: text }}>
                                        </a>
                                    )}
                                </Editable>
                            ))}
                        </div>
                        <div className="custom-support-wrap">
                            <Editable k="support_custom_amount" headless>
                                {({ text, styles, link }) => (
                                    <a href={link || "#"} className="btn-custom-support" style={styles} target="_blank" rel="noopener noreferrer" dangerouslySetInnerHTML={{ __html: text }}>
                                    </a>
                                )}
                            </Editable>
                        </div>
                    </div>
                    
                    <div className="production-support">
                        <Editable k="support_production_title">
                            {({ text, styles }) => <h3 style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                        </Editable>
                        <div className="production-grid">
                            {['200k', '400k', '800k', '1200k', '3m', '12m'].map((tier) => (
                                <Editable k={`support_production_${tier}`} key={tier} className="inline-block">
                                    {({ text, styles, link }) => (
                                        <a href={link || "#"} className="prod-btn" style={styles} target="_blank" rel="noopener noreferrer">
                                            <strong dangerouslySetInnerHTML={{ __html: text.split(' ')[0] }}></strong>
                                            <span dangerouslySetInnerHTML={{ __html: text.split(' ').slice(1).join(' ') }}></span>
                                        </a>
                                    )}
                                </Editable>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="account-card">
                    <div className="account-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <Editable k="support_account_title">
                            {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                        </Editable>
                    </div>
                    <div className="account-details">
                        <Editable k="support_account_bank">
                            {({ text, styles }) => <p className="bank-name" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                        </Editable>
                        <p className="account-number">164-890058-38004</p>
                        <Editable k="support_account_holder">
                            {({ text, styles }) => <p className="account-holder" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                        </Editable>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Support;
