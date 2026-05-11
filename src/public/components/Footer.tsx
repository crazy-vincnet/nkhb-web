import React from 'react';
import { useI18n } from '../lib/i18n';

const Footer: React.FC = () => {
    const { t } = useI18n();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <img src="https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png" alt={t('alt_logo')} loading="lazy" />
                    </div>
                    <div className="footer-info">
                        <p>{t('footer_contact')}</p>
                        <p>{t('footer_schedule')}</p>
                    </div>
                    <div className="footer-bottom">
                        <p dangerouslySetInnerHTML={{ __html: t('footer_copyright') }}></p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
