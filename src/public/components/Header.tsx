import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';

const Header: React.FC = () => {
    const { lang, setLang, t } = useI18n();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header>
            <nav>
                <div className="logo">
                    <Link to="/">
                        <img src={t('image_logo')} alt={t('alt_logo')} />
                    </Link>
                </div>

                <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-links">
                        <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>{t('nav_about')}</Link></li>
                        <li><Link to="/#background" onClick={() => setIsMenuOpen(false)}>{t('nav_background')}</Link></li>
                        <li><Link to="/#composition" onClick={() => setIsMenuOpen(false)}>{t('nav_composition')}</Link></li>
                        <li><Link to="/#effects" onClick={() => setIsMenuOpen(false)}>{t('nav_effects')}</Link></li>
                        <li><Link to="/#guide" onClick={() => setIsMenuOpen(false)}>{t('nav_guide')}</Link></li>
                        <li><Link to="/#support" onClick={() => setIsMenuOpen(false)}>{t('nav_support')}</Link></li>
                        <li><Link to="/#schedule" onClick={() => setIsMenuOpen(false)}>{t('nav_schedule')}</Link></li>
                    </ul>

                    <div className="lang-selector">
                        <a 
                            href="#" 
                            className={lang === 'ko' ? 'active' : ''} 
                            onClick={(e) => { e.preventDefault(); setLang('ko'); }}
                        >
                            한국어
                        </a>
                        <div className="lang-divider"></div>
                        <a 
                            href="#" 
                            className={lang === 'en' ? 'active' : ''} 
                            onClick={(e) => { e.preventDefault(); setLang('en'); }}
                        >
                            EN
                        </a>
                    </div>
                </div>

                <button 
                    className="mobile-menu-btn" 
                    aria-label="메뉴 열기"
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </header>
    );
};

export default Header;
