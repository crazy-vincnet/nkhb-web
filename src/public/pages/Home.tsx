import React, { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import { useI18n } from '../lib/i18n';
import { HOME_SECTION_MAP, HOME_DEFAULT_LAYOUT } from '../lib/registry';

const Home: React.FC = () => {
    const { getContent, lang } = useI18n();
    const location = useLocation();

    const layoutData = getContent('page_layout_home');
    const layout = Array.isArray((layoutData.styles as any)?.order) 
        ? (layoutData.styles as any).order 
        : HOME_DEFAULT_LAYOUT;

    // ⚡ Bolt Performance Optimization
    // Memoize modal callbacks to prevent unnecessary re-renders of child section components
    // when unrelated state changes occur in the parent App component.
    const handleOpenArticle = useCallback(() => {
        window.postMessage({ type: 'NKHB_OPEN_MODAL', modalType: 'article' }, '*');
    }, []);

    const handleOpenSample = useCallback(() => {
        window.postMessage({ type: 'NKHB_OPEN_MODAL', modalType: 'sample' }, '*');
    }, []);

    const handleOpenLetter = useCallback(() => {
        window.postMessage({ type: 'NKHB_OPEN_MODAL', modalType: 'letter' }, '*');
    }, []);

    useEffect(() => {
        // Handle smooth scrolling for hash links whenever location changes
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                const headerOffset = 100;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }, [location]);

    return (
        <>
            <SEO slug="home" />
            <main>
                {layout.map((key: string) => {
                    const id = key === 'support' && lang === 'en' ? 'support_en' : key;
                    const Component = HOME_SECTION_MAP[id];
                    if (!Component) return null;

                    const props: any = {};
                    if (key === 'background') props.onOpenArticle = handleOpenArticle;
                    if (key === 'composition') props.onOpenSample = handleOpenSample;
                    if (key === 'guide') props.onOpenLetter = handleOpenLetter;

                    return <Component key={key} {...props} />;
                })}
            </main>
        </>
    );
};

export default Home;
