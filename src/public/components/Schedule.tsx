import React, { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';

interface ScheduleItem {
    id: string;
    day: string;
    time: string;
    frequency: string;
    is_active: boolean;
}

const Schedule: React.FC = () => {
    const { t } = useI18n();
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        const fetchSchedule = async () => {
            const { data, error } = await supabase
                .from('schedule')
                .select('*')
                .eq('is_active', true);
            
            if (error) {
                console.error('Error fetching schedule:', error);
            } else if (data) {
                setScheduleData(data);
            }
        };

        fetchSchedule();
    }, []);

    return (
        <section className="section schedule" id="schedule">
            <div className="container">
                <div className="section-header">
                    <span className="section-tag">07 — Broadcast Schedule</span>
                    <h2>{t('schedule_title')}</h2>
                    <p className="description">{t('schedule_desc')}</p>
                </div>

                <div className="schedule-modern-grid" id="schedule-container">
                    {scheduleData.map((item) => (
                        <div key={item.id} className="schedule-modern-card">
                            <div className="card-bg-glow"></div>
                            <div className="card-content">
                                <div className="card-header">
                                    <div className="icon-wrap">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                        </svg>
                                    </div>
                                    <span className="day-text">{item.day}</span>
                                </div>
                                <div className="info-group">
                                    <div className="info-label">{t('schedule_card1_label_time')}</div>
                                    <div className="info-value">{item.time} <span className="unit">KST</span></div>
                                </div>
                                <div className="info-group">
                                    <div className="info-label">{t('schedule_card1_label_freq')}</div>
                                    <div className="info-value freq">{item.frequency}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="schedule-footer-notice">
                    <div className="notice-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <span>{t('schedule_notice')}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary re-renders
// when the parent component updates its state (e.g., opening modals).
export default React.memo(Schedule);
