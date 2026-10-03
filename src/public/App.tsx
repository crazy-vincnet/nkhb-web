import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Modals from './components/Modals';
import { useI18n } from './lib/i18n';

const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const DynamicPage = React.lazy(() => import('./pages/DynamicPage'));

/*
 * ⚡ Bolt Optimization:
 * 1. Extracted `ArticleModal`, `LetterModal`, and `SampleModal` states
 * into a separate `<Modals />` component to prevent full-page re-renders.
 * 2. Implemented `React.lazy` and `Suspense` for route components (`Home`, `About`, `DynamicPage`).
 * This introduces code splitting for routes, significantly reducing the initial bundle size
 * and improving the initial load performance by loading route chunks on demand.
 */
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
                    <React.Suspense fallback={
                        <div className="flex items-center justify-center h-screen bg-white">
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                    }>
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
                    </React.Suspense>
                    <Footer />
                </div>

                <Modals />
            </Router>
        </HelmetProvider>
    );
};

export default App;
