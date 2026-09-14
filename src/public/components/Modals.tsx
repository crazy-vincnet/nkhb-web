import { useState, useEffect, memo } from 'react';
import ArticleModal from './ArticleModal';
import LetterModal from './LetterModal';
import SampleModal from './SampleModal';

/*
 * ⚡ Bolt Optimization: Extract Modals to a separate component
 * This isolates the modal state (isArticleModalOpen, etc.) from the main App component.
 * Previously, opening a modal would cause a full re-render of the entire App tree.
 * Now, only this Modals component re-renders when a modal is opened/closed.
 * Wrapped in React.memo to ensure it doesn't re-render unnecessarily from parent props.
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
