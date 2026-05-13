import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import Background from '../components/Background';
import Composition from '../components/Composition';
import Effects from '../components/Effects';
import QuoteBanner from '../components/QuoteBanner';
import Reach from '../components/Reach';
import Guide from '../components/Guide';
import Support from '../components/Support';
import SupportEn from '../components/SupportEn';
import Schedule from '../components/Schedule';
import ArticleModal from '../components/ArticleModal';
import LetterModal from '../components/LetterModal';
import SampleModal from '../components/SampleModal';
import SEO from '../components/SEO';
import { useI18n } from '../lib/i18n';

const Home: React.FC = () => {
    const { lang } = useI18n();
    const location = useLocation();
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    // Performance: Memoize handlers to prevent unnecessary re-renders of static child sections
    const handleOpenArticle = useCallback(() => setIsArticleModalOpen(true), []);
    const handleCloseArticle = useCallback(() => setIsArticleModalOpen(false), []);

    const handleOpenSample = useCallback(() => setIsSampleModalOpen(true), []);
    const handleCloseSample = useCallback(() => setIsSampleModalOpen(false), []);

    const handleOpenLetter = useCallback(() => setIsLetterModalOpen(true), []);
    const handleCloseLetter = useCallback(() => setIsLetterModalOpen(false), []);

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
                <Hero />
                <Background onOpenArticle={handleOpenArticle} />
                <Composition onOpenSample={handleOpenSample} />
                <Effects />
                <QuoteBanner />
                <Reach />
                <Guide onOpenLetter={handleOpenLetter} />
                
                {lang === 'ko' ? <Support /> : <SupportEn />}
                
                <Schedule />
            </main>

            <ArticleModal 
                isOpen={isArticleModalOpen} 
                onClose={handleCloseArticle}
            />
            <LetterModal 
                isOpen={isLetterModalOpen} 
                onClose={handleCloseLetter}
            />
            <SampleModal 
                isOpen={isSampleModalOpen} 
                onClose={handleCloseSample}
            />
        </>
    );
};

export default Home;
