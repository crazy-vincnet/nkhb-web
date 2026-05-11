import React, { useState, useEffect } from 'react';
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
import { useI18n } from '../lib/i18n';

const Home: React.FC = () => {
    const { lang } = useI18n();
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    useEffect(() => {
        // Handle smooth scrolling for hash links
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
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
        };

        window.addEventListener('hashchange', handleHashChange);
        // Initial check
        if (window.location.hash) {
            setTimeout(handleHashChange, 100);
        }

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <>
            <main>
                <Hero />
                <Background onOpenArticle={() => setIsArticleModalOpen(true)} />
                <Composition onOpenSample={() => setIsSampleModalOpen(true)} />
                <Effects />
                <QuoteBanner />
                <Reach />
                <Guide onOpenLetter={() => setIsLetterModalOpen(true)} />
                
                {lang === 'ko' ? <Support /> : <SupportEn />}
                
                <Schedule />
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
