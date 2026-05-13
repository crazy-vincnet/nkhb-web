import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';

interface MenuItem {
    id: string;
    label_ko: string;
    label_en: string;
    path: string;
    order: number;
}

const Header: React.FC = () => {
    const { lang, setLang, t } = useI18n();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('is_active', true)
                .order('order', { ascending: true });

            if (data && !error) {
                setMenuItems(data);
            }
        };
        fetchMenu();
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Fallback static menu if DB is empty
    const displayMenu = menuItems.length > 0 ? menuItems : [
        { id: '1', label_ko: 'NKFI 소개', label_en: 'About Us', path: '/about', order: 1 },
        { id: '2', label_ko: '방송배경', label_en: 'Background', path: '/#background', order: 2 },
        { id: '3', label_ko: '방송구성', label_en: 'Program', path: '/#composition', order: 3 },
        { id: '4', label_ko: '기대효과', label_en: 'Impact', path: '/#effects', order: 4 },
        { id: '5', label_ko: '참여 안내', label_en: 'Get Involved', path: '/#guide', order: 5 },
        { id: '6', label_ko: '후원하기', label_en: 'Donate', path: '/#support', order: 6 },
        { id: '7', label_ko: '방송시간', label_en: 'Schedule', path: '/#schedule', order: 7 },
    ];

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
                        {displayMenu.map((item) => (
                            <li key={item.id}>
                                <Link to={item.path} onClick={() => setIsMenuOpen(false)}>
                                    {lang === 'ko' ? item.label_ko : item.label_en}
                                </Link>
                            </li>
                        ))}
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
