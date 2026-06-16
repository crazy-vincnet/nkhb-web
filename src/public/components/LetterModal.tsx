import React, { useState, useRef } from 'react';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Editable } from './Editable';
import { useModalBehavior } from '../lib/useModalBehavior';

interface LetterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
    const { lang } = useI18n();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useModalBehavior(isOpen, onClose, contentRef);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            location: formData.get('location') as string,
            reason: formData.get('reason') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string
        };

        try {
            const { error: dbError } = await supabase
                .from('letters')
                .insert([data]);

            // The DB insert is the source of truth. If it fails, nothing was saved,
            // so it is safe for the user to retry.
            if (dbError) throw dbError;

            // Email delivery is best-effort: the letter is already saved. A failure
            // here must NOT surface as an error, otherwise the user resubmits and we
            // get a duplicate row.
            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Server responded with error');
                }
            } catch (emailError) {
                console.error('Letter saved, but email notification failed:', emailError);
            }

            setStatus({
                type: 'success',
                msg: lang === 'en' ? 'Letter sent successfully.' : '편지가 성공적으로 전송되었습니다.'
            });
            setTimeout(() => onClose(), 1800);
        } catch (error) {
            setStatus({
                type: 'error',
                msg: lang === 'en' ? 'Failed to send. Please try again.' : '전송에 실패했습니다. 다시 시도해주세요.'
            });
            console.error('Error!', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="letter-modal-title" ref={contentRef}>
                <div className="modal-header">
                    <Editable k="letter_modal_title">
                        {({ text, styles }) => <h3 id="letter-modal-title" style={styles} dangerouslySetInnerHTML={{ __html: text }}></h3>}
                    </Editable>
                    <button className="close-modal" onClick={onClose} aria-label="Close">&times;</button>
                </div>
                <form id="letter-form" onSubmit={handleSubmit}>
                    <div className="form-group-row">
                        <div className="form-group">
                            <Editable k="letter_modal_label_name">
                                {({ text, styles }) => <label style={styles} dangerouslySetInnerHTML={{ __html: text }}></label>}
                            </Editable>
                            <Editable k="letter_modal_placeholder_name">
                                {({ text }) => <input type="text" name="name" placeholder={text} required />}
                            </Editable>
                        </div>
                        <div className="form-group">
                            <Editable k="letter_modal_label_location">
                                {({ text, styles }) => <label style={styles} dangerouslySetInnerHTML={{ __html: text }}></label>}
                            </Editable>
                            <Editable k="letter_modal_placeholder_location">
                                {({ text }) => <input type="text" name="location" placeholder={text} required />}
                            </Editable>
                        </div>
                    </div>
                    <div className="form-group">
                        <Editable k="letter_modal_label_reason">
                            {({ text, styles }) => <label style={styles} dangerouslySetInnerHTML={{ __html: text }}></label>}
                        </Editable>
                        <Editable k="letter_modal_placeholder_reason">
                            {({ text }) => <input type="text" name="reason" placeholder={text} required />}
                        </Editable>
                    </div>
                    <div className="form-group">
                        <Editable k="letter_modal_label_email">
                            {({ text, styles }) => <label style={styles} dangerouslySetInnerHTML={{ __html: text }}></label>}
                        </Editable>
                        <input type="email" name="email" placeholder={lang === 'en' ? 'Enter the email address where you would like to receive a reply' : '답변을 받으실 이메일 주소를 입력해주세요'} required />
                    </div>
                    <div className="form-group">
                        <Editable k="letter_modal_label_message">
                            {({ text, styles }) => <label style={styles} dangerouslySetInnerHTML={{ __html: text }}></label>}
                        </Editable>
                        <Editable k="letter_modal_placeholder_message">
                            {({ text }) => <textarea name="message" rows={8} placeholder={text} required></textarea>}
                        </Editable>
                    </div>
                    <div className="form-footer">
                        <Editable k="letter_modal_footer_note">
                            {({ text, styles }) => <p className="form-note" style={styles} dangerouslySetInnerHTML={{ __html: text }}></p>}
                        </Editable>
                        {status && (
                            <p
                                role="status"
                                aria-live="polite"
                                style={{
                                    margin: '0 0 12px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: status.type === 'success' ? '#15803d' : '#dc2626',
                                }}
                            >
                                {status.msg}
                            </p>
                        )}
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? (lang === 'en' ? 'Sending...' : '전송 중...') : (
                                <Editable k="letter_modal_button_submit">
                                    {({ text, styles }) => <span style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                                </Editable>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LetterModal;
