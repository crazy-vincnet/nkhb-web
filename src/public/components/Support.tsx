import React from 'react';
import { useI18n } from '../lib/i18n';

const Support: React.FC = () => {
    const { t } = useI18n();

    return (
        <section className="section support" id="support">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">06 — Support</span>
                    <h2>{t('support_title')}</h2>
                    <p className="description">{t('support_desc')}</p>
                </div>

                <div className="participation-sub-section" id="support-sub">
                    <p className="sub-description" dangerouslySetInnerHTML={{ __html: t('support_appeal_desc') }}></p>
                </div>

                <div className="impact-info-container">
                    <div className="impact-box">
                        <h3>{t('support_impact1_title')}</h3>
                        <ul>
                            <li dangerouslySetInnerHTML={{ __html: t('support_impact1_li1') }}></li>
                            <li dangerouslySetInnerHTML={{ __html: t('support_impact1_li2') }}></li>
                            <li dangerouslySetInnerHTML={{ __html: t('support_impact1_li3') }}></li>
                        </ul>
                    </div>
                    <div className="impact-box">
                        <h3>{t('support_impact2_title')}</h3>
                        <ul>
                            <li dangerouslySetInnerHTML={{ __html: t('support_impact2_li1') }}></li>
                            <li dangerouslySetInnerHTML={{ __html: t('support_impact2_li2') }}></li>
                            <li dangerouslySetInnerHTML={{ __html: t('support_impact2_li3') }}></li>
                        </ul>
                    </div>
                </div>

                <div className="support-boxes-container">
                    <div className="production-support">
                        <h3>{t('support_regular_title')}</h3>
                        <div className="tier-buttons">
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=30000&background=NKFI"
                                className="tier-btn tier-btn-main" target="_blank" rel="noopener noreferrer">
                                {t('support_regular_30k')}
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=50000&background=NKFI"
                                className="tier-btn" target="_blank" rel="noopener noreferrer">
                                {t('support_regular_50k')}
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=100000&background=NKFI"
                                className="tier-btn" target="_blank" rel="noopener noreferrer">
                                {t('support_regular_100k')}
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=200000&background=NKFI"
                                className="tier-btn" target="_blank" rel="noopener noreferrer">
                                {t('support_regular_200k')}
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=300000&background=NKFI"
                                className="tier-btn" target="_blank" rel="noopener noreferrer">
                                {t('support_regular_300k')}
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=500000&background=NKFI"
                                className="tier-btn" target="_blank" rel="noopener noreferrer">
                                {t('support_regular_500k')}
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=1000000&background=NKFI"
                                className="tier-btn" target="_blank" rel="noopener noreferrer">
                                {t('support_regular_1m')}
                            </a>
                        </div>
                        <div className="custom-support-wrap">
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=background=NKFI"
                                className="btn-custom-support" target="_blank" rel="noopener noreferrer">
                                {t('support_custom_amount')}
                            </a>
                        </div>
                    </div>
                    <div className="production-support">
                        <h3>{t('support_production_title')}</h3>
                        <div className="production-grid">
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=200000&background=NKFI"
                                className="prod-btn" target="_blank" rel="noopener noreferrer">
                                <strong dangerouslySetInnerHTML={{ __html: t('support_production_200k').split(' ')[0] }}></strong>
                                <span dangerouslySetInnerHTML={{ __html: t('support_production_200k').split(' ').slice(1).join(' ') }}></span>
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=400000&background=NKFI"
                                className="prod-btn" target="_blank" rel="noopener noreferrer">
                                <strong dangerouslySetInnerHTML={{ __html: t('support_production_400k').split(' ')[0] }}></strong>
                                <span dangerouslySetInnerHTML={{ __html: t('support_production_400k').split(' ').slice(1).join(' ') }}></span>
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=800000&background=NKFI"
                                className="prod-btn" target="_blank" rel="noopener noreferrer">
                                <strong dangerouslySetInnerHTML={{ __html: t('support_production_800k').split(' ')[0] }}></strong>
                                <span dangerouslySetInnerHTML={{ __html: t('support_production_800k').split(' ').slice(1).join(' ') }}></span>
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=1200000&background=NKFI"
                                className="prod-btn" target="_blank" rel="noopener noreferrer">
                                <strong dangerouslySetInnerHTML={{ __html: t('support_production_1200k').split(' ')[0] }}></strong>
                                <span dangerouslySetInnerHTML={{ __html: t('support_production_1200k').split(' ').slice(1).join(' ') }}></span>
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=3000000&background=NKFI"
                                className="prod-btn" target="_blank" rel="noopener noreferrer">
                                <strong dangerouslySetInnerHTML={{ __html: t('support_production_3m').split(' ')[0] }}></strong>
                                <span dangerouslySetInnerHTML={{ __html: t('support_production_3m').split(' ').slice(1).join(' ') }}></span>
                            </a>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=12000000&background=NKFI"
                                className="prod-btn" target="_blank" rel="noopener noreferrer">
                                <strong dangerouslySetInnerHTML={{ __html: t('support_production_12m').split(' ')[0] }}></strong>
                                <span dangerouslySetInnerHTML={{ __html: t('support_production_12m').split(' ').slice(1).join(' ') }}></span>
                            </a>
                        </div>
                        <div className="custom-support-wrap" style={{ marginTop: '20px' }}>
                            <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=background=NKFI"
                                className="btn-custom-support" target="_blank" rel="noopener noreferrer">
                                {t('support_custom_amount')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="account-card">
                    <div className="account-header">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        <span>{t('support_account_title')}</span>
                    </div>
                    <div className="account-details">
                        <p className="bank-name">{t('support_account_bank')}</p>
                        <p className="account-number">164-890058-38004</p>
                        <p className="account-holder">{t('support_account_holder')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Support;
