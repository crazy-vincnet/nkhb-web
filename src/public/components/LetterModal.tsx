import React, { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import emailjs from '@emailjs/browser';

interface LetterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose }) => {
    const { t, lang } = useI18n();
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            location: formData.get('location') as string,
            reason: formData.get('reason') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string
        };

        try {
            // 1. Save to Supabase (Database Backup)
            const { error: dbError } = await supabase
                .from('letters')
                .insert([data]);

            if (dbError) throw dbError;

            // 2. Send via EmailJS (Real-time Notification)
            // Note: These IDs should be in your .env file
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            if (serviceId && templateId && publicKey) {
                await emailjs.send(
                    serviceId,
                    templateId,
                    {
                        from_name: data.name,
                        from_email: data.email,
                        location: data.location,
                        reason: data.reason,
                        message: data.message,
                        to_name: "NKHB Admin", // You can customize this
                    },
                    publicKey
                );
            }

            const msg = lang === 'en' ? 'Letter sent successfully.' : '편지가 성공적으로 전송되었습니다.';
            alert(msg);
            onClose();
        } catch (error) {
            const msg = lang === 'en' ? 'Failed to send. Please try again.' : '전송에 실패했습니다. 다시 시도해주세요.';
            alert(msg);
            console.error('Error!', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal active" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{t('letter_modal_title')}</h3>
                    <button className="close-modal" aria-label={t('alt_close')} onClick={onClose}>&times;</button>
                </div>
                <form id="letter-form" onSubmit={handleSubmit}>
                    <div className="form-group-row">
                        <div className="form-group">
                            <label htmlFor="user-name">{t('letter_modal_label_name')}</label>
                            <input type="text" id="user-name" name="name" placeholder={t('letter_modal_placeholder_name')} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user-location">{t('letter_modal_label_location')}</label>
                            <input type="text" id="user-location" name="location" placeholder={t('letter_modal_placeholder_location')} required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-reason">{t('letter_modal_label_reason')}</label>
                        <input type="text" id="user-reason" name="reason" placeholder={t('letter_modal_placeholder_reason')} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-email">{t('letter_modal_label_email')}</label>
                        <input type="email" id="user-email" name="email" placeholder="답변을 받으실 이메일 주소를 입력해주세요" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="user-message">{t('letter_modal_label_message')}</label>
                        <textarea id="user-message" name="message" rows={8}
                            placeholder={t('letter_modal_placeholder_message')}
                            required></textarea>
                    </div>
                    <div className="form-footer">
                        <p className="form-note">{t('letter_modal_footer_note')}</p>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? (lang === 'en' ? 'Sending...' : '전송 중...') : t('letter_modal_button_submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LetterModal;
