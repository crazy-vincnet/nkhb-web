import React, { useState, useEffect } from 'react';
import ArticleModal from './ArticleModal';
import LetterModal from './LetterModal';
import SampleModal from './SampleModal';

/**
 * ⚡ Bolt Performance Optimization:
 * Isolating the modal state in this Modals component prevents the entire
 * <App /> and its routed pages from re-rendering whenever a modal is opened or closed.
 * Using React.memo ensures this component only re-renders when its own state changes.
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
