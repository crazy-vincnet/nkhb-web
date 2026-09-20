import React, { useState, useEffect, useCallback } from 'react';
import ArticleModal from './ArticleModal';
import LetterModal from './LetterModal';
import SampleModal from './SampleModal';

/* ⚡ Bolt Optimization:
 * Extracted top-level modal state (`isArticleModalOpen`, etc.) from `App.tsx`
 * into this isolated component wrapped with `React.memo`. This prevents full-page
 * re-renders of the entire routing context whenever a modal is toggled.
 * Handlers are wrapped in `useCallback` to prevent unnecessary child re-renders.
 */
const ModalsComponent = () => {
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
};

export const Modals = React.memo(ModalsComponent);
