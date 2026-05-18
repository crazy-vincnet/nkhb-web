import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ArticleModal from '../components/ArticleModal';
import LetterModal from '../components/LetterModal';
import SampleModal from '../components/SampleModal';
import SEO from '../components/SEO';
import { useI18n } from '../lib/i18n';
import { HOME_SECTION_MAP, HOME_DEFAULT_LAYOUT } from '../lib/registry';


const MemoizedSection = React.memo(({ Component, ...props }: { Component: React.ElementType, [key: string]: any }) => {
    return <Component {...props} />;
});

const Home: React.FC = () => {

    const { getContent, lang } = useI18n();
    const location = useLocation();
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    // ⚡ Bolt: Memoize handlers to prevent unnecessary re-renders of static sections
    const handleOpenArticle = useCallback(() => setIsArticleModalOpen(true), []);
    const handleOpenSample = useCallback(() => setIsSampleModalOpen(true), []);
    const handleOpenLetter = useCallback(() => setIsLetterModalOpen(true), []);

    const layoutData = getContent('page_layout_home');
    const layout = Array.isArray((layoutData.styles as any)?.order) 
        ? (layoutData.styles as any).order 
        : HOME_DEFAULT_LAYOUT;


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

                    return <MemoizedSection key={key} Component={Component} {...props} />;
                })}
            </main>

            <ArticleModal 
                isOpen={isArticleModalOpen} 
                onClose={() => setIsArticleModalOpen(false)} 
            />
            <LetterModal 
                isOpen={isLetterModalOpen} 
                onClose={() => setIsLetterModalOpen(false)} 
            />
            <SampleModal 
                isOpen={isSampleModalOpen} 
                onClose={() => setIsSampleModalOpen(false)} 
            />
        </>
    );
};

export default Home;
