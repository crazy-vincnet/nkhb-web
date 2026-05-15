import React from 'react';
import { Editable } from './Editable';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">
                        <Editable k="logo_url">
                            {({ link }) => <img src={link} alt="logo" loading="lazy" />}
                        </Editable>
                    </div>
                    <div className="footer-info">
                        <Editable k="footer_contact">
                            {({ text, styles }) => <p style={styles}>{text}</p>}
                        </Editable>
                        <Editable k="footer_schedule">
                            {({ text, styles }) => <p style={styles}>{text}</p>}
                        </Editable>
                    </div>
                    <div className="footer-bottom">
                        <Editable k="footer_copyright">
                            {({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                        </Editable>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
