import React, { useState, useEffect } from 'react';
import ArticleModal from './ArticleModal';
import LetterModal from './LetterModal';
import SampleModal from './SampleModal';

/**
 * ⚡ Bolt Performance Optimization:
 * Extracted modal states from App.tsx into this isolated Modals component.
 *
 * 💡 What: Moved `is*ModalOpen` states and the 'message' event listener into a dedicated component wrapped in `React.memo`.
 * 🎯 Why: Previously, opening a modal caused the entire `App` component (Header, Routes, Footer) to re-render.
 * 📊 Impact: Eliminates full-page re-renders on modal open/close. Now, only this `<Modals />` component updates its state.
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

    return (
        <>
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
});

export default Modals;
