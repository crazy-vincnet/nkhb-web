import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import DynamicPage from './pages/DynamicPage';
import ScrollToTop from './components/ScrollToTop';
import ArticleModal from './components/ArticleModal';
import LetterModal from './components/LetterModal';
import SampleModal from './components/SampleModal';
import { useI18n } from './lib/i18n';

const Modals = React.memo(() => {
    const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'NKHB_OPEN_MODAL') {
                const { modalType } = event.data;
                if (modalType === 'article') setIsArticleModalOpen(true);
                if (modalType === 'letter') setIsLetterModalOpen(true);
                if (modalType === 'sample') setIsSampleModalOpen(true);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const closeArticleModal = useCallback(() => setIsArticleModalOpen(false), []);
    const closeLetterModal = useCallback(() => setIsLetterModalOpen(false), []);
    const closeSampleModal = useCallback(() => setIsSampleModalOpen(false), []);

    return (
        <>
            <ArticleModal isOpen={isArticleModalOpen} onClose={closeArticleModal} />
            <LetterModal isOpen={isLetterModalOpen} onClose={closeLetterModal} />
            <SampleModal isOpen={isSampleModalOpen} onClose={closeSampleModal} />
        </>
    );
});
Modals.displayName = 'Modals';

const App: React.FC = () => {
    const { lang, loading } = useI18n();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <HelmetProvider>
            <Router>
                <ScrollToTop />
                <div className={`app-container ${lang}`}>
                    <Header />
                    <Routes>
                        {/* Standard Routes (Korean) */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/p/:slug" element={<DynamicPage />} />

                        {/* English Routes (Prefix matching) */}
                        <Route path="/en" element={<Home />} />
                        <Route path="/en/about" element={<About />} />
                        <Route path="/en/p/:slug" element={<DynamicPage />} />
                        
                        {/* Fallback English Catch-all */}
                        <Route path="/en/*" element={<Home />} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                    <Footer />
                </div>

                <Modals />
            </Router>
        </HelmetProvider>
    );
};

export default App;
