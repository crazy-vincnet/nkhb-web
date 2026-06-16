import React, { useRef } from 'react';
import { Editable } from './Editable';
import { useModalBehavior } from '../lib/useModalBehavior';

interface ArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    useModalBehavior(isOpen, onClose, contentRef);

    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content wide" role="dialog" aria-modal="true" aria-labelledby="article-modal-title" ref={contentRef}>
                <div className="modal-header">
                    <Editable k="article_modal_title">
                        {({ text, styles }) => <h3 id="article-modal-title" style={styles}>{text}</h3>}
                    </Editable>
                    <button className="close-modal-article" onClick={onClose} aria-label="Close">&times;</button>
                </div>
                <div className="modal-body-article">
                    <div className="article-content-inner">
                        <Editable k="article_p1">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>
                        <Editable k="article_p2">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>

                        <div className="article-quote-box">
                            <Editable k="article_quote1">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>
                        </div>

                        <Editable k="article_p3">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>
                        <Editable k="article_p4">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>
                        <Editable k="article_p5">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>

                        <div className="article-quote-box">
                            <Editable k="article_quote2">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>
                        </div>

                        <Editable k="article_p6">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>
                        <Editable k="article_p7">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>
                        <Editable k="article_p8">{({ text, styles }) => <p style={styles}>{text}</p>}</Editable>

                        <Editable k="article_p9">{({ text, styles }) => <p style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}</Editable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;
