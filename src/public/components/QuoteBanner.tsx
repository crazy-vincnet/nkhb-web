import React from 'react';
import { useI18n } from '../lib/i18n';

const QuoteBanner: React.FC = () => {
    const { t } = useI18n();

    return (
        <div className="quote-banner">
            <div className="banner-overlay"></div>
            <div className="banner-text">
                <p dangerouslySetInnerHTML={{ __html: t('quote_banner_text') }}></p>
            </div>
        </div>
    );
};

export default QuoteBanner;
