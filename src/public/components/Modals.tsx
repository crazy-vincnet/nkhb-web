import { useState, useEffect, memo } from 'react';
import ArticleModal from './ArticleModal';
import LetterModal from './LetterModal';
import SampleModal from './SampleModal';

/**
 * ⚡ Bolt Performance Optimization:
 * Extracted modal states from App.tsx into this separate, memoized component.
 *
 * 💡 What: Colocated modal state management (isArticleModalOpen, etc.) and the
 *         message event listener inside this isolated <Modals /> component.
 * 🎯 Why: Previously, opening or closing a modal triggered a full re-render of App.tsx,
 *         including the Router, Header, Footer, and active page components.
 * 📊 Impact: Prevents expensive re-renders at the root level, ensuring only the
 *            modals re-render when their states change.
 */
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

Modals.displayName = 'Modals';

export default Modals;
