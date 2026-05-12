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
import SEO from '../components/SEO';
import { getPageBySlug, CMSPage } from '../lib/cms';
import CMSPageRenderer from '../components/CMSPageRenderer';

const Home: React.FC = () => {
    const { lang, t } = useI18n();
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
    const [pageData, setPageData] = useState<CMSPage | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const data = await getPageBySlug('home');
                setPageData(data);
            } catch (error) {
                console.error('Failed to fetch page data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPageData();

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

    const seoTitle = lang === 'ko' ? pageData?.seo_title_ko : pageData?.seo_title_en;
    const seoDescription = lang === 'ko' ? pageData?.seo_description_ko : pageData?.seo_description_en;

    return (
        <>
            <SEO 
                title={seoTitle || t('page_title')}
                description={seoDescription || t('meta_description')}
                image={pageData?.seo_image_url}
                lang={lang}
            />
            <main>
                {pageData?.layout_json ? (
                    <CMSPageRenderer 
                        layout={pageData.layout_json}
                        onOpenArticle={() => setIsArticleModalOpen(true)}
                        onOpenSample={() => setIsSampleModalOpen(true)}
                        onOpenLetter={() => setIsLetterModalOpen(true)}
                    />
                ) : (
                    <>
                        <Hero />
                        <Background onOpenArticle={() => setIsArticleModalOpen(true)} />
                        <Composition onOpenSample={() => setIsSampleModalOpen(true)} />
                        <Effects />
                        <QuoteBanner />
                        <Reach />
                        <Guide onOpenLetter={() => setIsLetterModalOpen(true)} />
                        
                        {lang === 'ko' ? <Support /> : <SupportEn />}
                        
                        <Schedule />
                    </>
                )}
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