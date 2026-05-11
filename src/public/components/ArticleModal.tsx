import React from 'react';
import { useI18n } from '../lib/i18n';

interface ArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ isOpen, onClose }) => {
    const { t } = useI18n();

    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content wide">
                <div className="modal-header">
                    <h3>{t('article_modal_title')}</h3>
                    <button className="close-modal-article" aria-label={t('alt_close')} onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body-article">
                    <div className="article-content-inner">
                        <p>{t('article_p1')}</p>
                        <p>{t('article_p2')}</p>

                        <div className="article-quote-box">
                            <p>{t('article_quote1')}</p>
                        </div>

                        <p>{t('article_p3')}</p>
                        <p>{t('article_p4')}</p>
                        <p>{t('article_p5')}</p>

                        <div className="article-quote-box">
                            <p>{t('article_quote2')}</p>
                        </div>

                        <p>{t('article_p6')}</p>
                        <p>{t('article_p7')}</p>
                        <p>{t('article_p8')}</p>

                        <p dangerouslySetInnerHTML={{ __html: t('article_p9') }}></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;
