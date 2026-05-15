import React from 'react';
import { Editable } from './Editable';

const QuoteBanner: React.FC = () => {
    return (
        <div className="quote-banner">
            <div className="banner-overlay"></div>
            <div className="banner-text">
                <Editable k="quote_banner_text">
                    {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                </Editable>
            </div>
        </div>
    );
};

export default QuoteBanner;
