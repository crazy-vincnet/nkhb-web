import React, { useState, useEffect, useCallback } from 'react';
import ArticleModal from './ArticleModal';
import LetterModal from './LetterModal';
import SampleModal from './SampleModal';

/**
 * ⚡ Bolt Optimization: Extracted modal state from root App component.
 *
 * 💡 What: Moved `isArticleModalOpen`, `isLetterModalOpen`, and `isSampleModalOpen`
 * state, along with the `window.postMessage` listener, into this isolated component.
 * Wrapped with `React.memo` and `useCallback` for event handlers.
 *
 * 🎯 Why: Previously, these states lived in `App.tsx`. Because of React's top-down
 * rendering flow, toggling any modal caused the ENTIRE application tree (including
 * all routes and complex child components) to re-render.
 *
 * 📊 Impact: Prevents unnecessary full-page React re-renders when toggling modals,
 * significantly reducing CPU time and React commit phase duration on modal interactions.
 *
 * 🔬 Measurement: Open React Developer Tools Profiler, record while toggling a modal.
 * Only `<Modals>` and the specific toggled modal should highlight/re-render, rather
 * than the root `<App>` and `<Routes>`.
 */
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

    // ⚡ Bolt: useCallback prevents creating new function references on every render,
    // which would otherwise break memoization in child modal components (if they use it).
    const closeArticleModal = useCallback(() => setIsArticleModalOpen(false), []);
    const closeLetterModal = useCallback(() => setIsLetterModalOpen(false), []);
    const closeSampleModal = useCallback(() => setIsSampleModalOpen(false), []);

    return (
        <>
            <ArticleModal
                isOpen={isArticleModalOpen}
                onClose={closeArticleModal}
            />
            <LetterModal
                isOpen={isLetterModalOpen}
                onClose={closeLetterModal}
            />
            <SampleModal
                isOpen={isSampleModalOpen}
                onClose={closeSampleModal}
            />
        </>
    );
});

export default Modals;
