import React from 'react';
import { useI18n } from '../lib/i18n';

interface CompositionProps {
    onOpenSample: () => void;
}

const Composition: React.FC<CompositionProps> = ({ onOpenSample }) => {
    const { t } = useI18n();

    return (
        <section className="section composition" id="composition">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">02 — Program Structure</span>
                    <h2>{t('composition_title')}</h2>
                    <p className="description">{t('composition_desc')}</p>
                </div>

                <div className="theme-grid">
                    <div className="theme-card">
                        <div className="card-num">1</div>
                        <h3>{t('composition_card1_title')}</h3>
                        <p>{t('composition_card1_desc')}</p>
                    </div>
                    <div className="theme-card">
                        <div className="card-num">2</div>
                        <h3>{t('composition_card2_title')}</h3>
                        <p>{t('composition_card2_desc')}</p>
                    </div>
                    <div className="theme-card">
                        <div className="card-num">3</div>
                        <h3>{t('composition_card3_title')}</h3>
                        <p>{t('composition_card3_desc')}</p>
                    </div>
                    <div className="theme-card">
                        <div className="card-num">4</div>
                        <h3>{t('composition_card4_title')}</h3>
                        <p>{t('composition_card4_desc')}</p>
                    </div>
                </div>

                <div className="composition-action">
                    <button 
                        id="open-sample-modal" 
                        className="btn-sample-wide"
                        onClick={onOpenSample}
                    >
                        {t('composition_button_sample')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Composition;
