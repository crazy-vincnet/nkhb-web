import { useState, useEffect, useCallback, memo } from 'react';
import ArticleModal from './ArticleModal';
import LetterModal from './LetterModal';
import SampleModal from './SampleModal';

// ⚡ Bolt Performance Optimization:
// Extracted modal state from App.tsx into this isolated Modals component.
// This prevents full-page re-renders when a modal is opened or closed,
// significantly improving perceived performance and reducing unnecessary component lifecycles.
const Modals = memo(() => {
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
});

Modals.displayName = 'Modals';

export default Modals;
