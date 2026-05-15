import React from 'react';
import { Editable } from './Editable';

const QuoteBanner: React.FC = () => {
    return (
        <Editable k="section_quote" headless>
            {({ styles: sMain, link: lMain }) => (
                <div 
                    className="quote-banner"
                    style={{
                        backgroundImage: `url('${lMain || 'https://cdn.imweb.me/thumbnail/20260424/c5c29f6641d8f.jpg'}')`,
                        ...sMain
                    }}
                >
                    <div className="banner-overlay"></div>
                    <div className="banner-text">
                        <Editable k="quote_banner_text" headless>
                            {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                        </Editable>
                    </div>
                </div>
            )}
        </Editable>
    );
};

export default QuoteBanner;
