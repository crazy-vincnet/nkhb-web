import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { ChevronDown } from 'lucide-react';
import { Editable } from './Editable';

interface MenuItem {
    id: string;
    label_ko: string;
    label_en: string;
    path: string;
    order: number;
    parent_id: string | null;
    children?: MenuItem[];
}

const Header: React.FC = () => {
    const { lang, setLang } = useI18n();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const fetchMenu = async () => {
            const { data, error } = await supabase
                .from('menu_items')
                .select('*')
                .eq('is_active', true)
                .order('order', { ascending: true });

            if (data && !error) {
                const roots = data.filter(i => !i.parent_id);
                const children = data.filter(i => i.parent_id);
                
                const hierarchy = roots.map(root => ({
                    ...root,
                    children: children.filter(child => child.parent_id === root.id)
                }));
                
                setMenuItems(hierarchy);
            }
        };
        fetchMenu();
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
        setActiveDropdown(null);
    }, [location]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const displayMenu = menuItems.length > 0 ? menuItems : [
        { id: '1', label_ko: 'NKFI 소개', label_en: 'About Us', path: '/about', order: 1, parent_id: null },
        { id: '2', label_ko: '방송안내', label_en: 'Broadcast', path: '#', order: 2, parent_id: null, children: [
            { id: '2-1', label_ko: '방송배경', label_en: 'Background', path: '/#background', order: 1, parent_id: '2' },
            { id: '2-2', label_ko: '방송구성', label_en: 'Program', path: '/#composition', order: 2, parent_id: '2' },
            { id: '2-3', label_ko: '기대효과', label_en: 'Impact', path: '/#effects', order: 3, parent_id: '2' },
        ]},
        { id: '3', label_ko: '참여 안내', label_en: 'Get Involved', path: '/#guide', order: 3, parent_id: null },
        { id: '4', label_ko: '후원하기', label_en: 'Donate', path: '/#support', order: 4, parent_id: null },
        { id: '5', label_ko: '방송시간', label_en: 'Schedule', path: '/#schedule', order: 5, parent_id: null },
    ];

    return (
        <header>
            <nav>
                <div className="logo">
                    <Editable k="logo_url" headless>
                        {({ link, styles }) => (
                            <Link to="/">
                                <img src={link} alt="logo" style={styles} />
                            </Link>
                        )}
                    </Editable>
                </div>

                <div id="primary-nav" className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav-links">
                        {displayMenu.map((item) => (
                            <li 
                                key={item.id} 
                                className={item.children && item.children.length > 0 ? 'has-dropdown' : ''}
                                onMouseEnter={() => !isMenuOpen && item.children && setActiveDropdown(item.id)}
                                onMouseLeave={() => !isMenuOpen && setActiveDropdown(null)}
                            >
                                {item.children && item.children.length > 0 ? (
                                    <>
                                        <button
                                            type="button"
                                            className="menu-item-wrapper"
                                            aria-haspopup="true"
                                            aria-expanded={activeDropdown === item.id}
                                            onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                                        >
                                            <span className="nav-link-text">
                                                {lang === 'ko' ? item.label_ko : item.label_en}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 ml-1 opacity-50 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''}`} />
                                        </button>
                                        <ul className={`dropdown-menu ${activeDropdown === item.id ? 'active' : ''}`}>
                                            {item.children.map(child => (
                                                <li key={child.id}>
                                                    <Link to={child.path}>
                                                        {lang === 'ko' ? child.label_ko : child.label_en}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Link to={item.path}>
                                        {lang === 'ko' ? item.label_ko : item.label_en}
                                    </Link>
                                )}
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

                <div className="lang-selector lang-selector-mobile">
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

                <button
                    className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
                    aria-label={isMenuOpen ? (lang === 'en' ? 'Close menu' : '메뉴 닫기') : (lang === 'en' ? 'Open menu' : '메뉴 열기')}
                    aria-expanded={isMenuOpen}
                    aria-controls="primary-nav"
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
