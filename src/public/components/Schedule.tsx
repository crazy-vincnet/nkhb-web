import React, { useEffect, useState } from 'react';
import { useI18n } from '../lib/i18n';
import { supabase } from '../lib/supabase';
import { Editable } from './Editable';

interface ScheduleItem {
    id: string;
    day?: string;
    day_ko?: string;
    day_en?: string;
    time: string;
    frequency: string;
    is_active: boolean;
    visible_from?: string | null;
    visible_until?: string | null;
}

// Per-item exposure window set in the admin. Either bound may be null,
// meaning "no limit in that direction".
const isWithinWindow = (item: ScheduleItem, now: number) => {
    if (item.visible_from && now < new Date(item.visible_from).getTime()) return false;
    if (item.visible_until && now > new Date(item.visible_until).getTime()) return false;
    return true;
};

const DEFAULT_BOX_COUNT = 1;
const DEFAULT_EFFECTIVE_FROM = '2026-08-31';

const getKoreanDate = () =>
    new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());

const Schedule: React.FC = () => {
    const { t, lang } = useI18n();
    const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
    const [boxCount, setBoxCount] = useState(2);

    // Pick the day label for the active language, falling back across the
    // bilingual columns and the legacy single `day` (pre-migration safety).
    const getDay = (item: ScheduleItem) =>
        (lang === 'ko' ? item.day_ko : item.day_en) || item.day_ko || item.day_en || item.day || '';

    useEffect(() => {
        const fetchSchedule = async () => {
            const [scheduleResult, settingsResult] = await Promise.all([
                supabase
                    .from('schedule')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: true }),
                supabase
                    .from('sites_settings')
                    .select('key, value_ko')
                    .in('key', ['schedule_box_count', 'schedule_box_count_effective_from']),
            ]);

            const { data, error } = scheduleResult;
            
            if (error) {
                console.error('Error fetching schedule:', error);
            } else if (data) {
                const now = Date.now();
                setScheduleData(data.filter((item) => isWithinWindow(item, now)));
            }

            const settings = new Map(
                (settingsResult.data || []).map((setting) => [setting.key, setting.value_ko || ''])
            );
            const configuredCount = Number(settings.get('schedule_box_count') || DEFAULT_BOX_COUNT);
            const effectiveFrom = settings.get('schedule_box_count_effective_from') || DEFAULT_EFFECTIVE_FROM;
            const isEffective = !effectiveFrom || getKoreanDate() >= effectiveFrom;

            if (isEffective && (configuredCount === 1 || configuredCount === 2)) {
                setBoxCount(configuredCount);
            }
        };

        fetchSchedule();
    }, []);

    const visibleSchedule = scheduleData.slice(0, boxCount);

    return (
        <section className="section schedule" id="schedule">
            <div className="container">
                <div className="section-header">
                    <Editable k="schedule_tag" headless>
                        {({ text, styles }) => <span className="section-tag" style={styles} dangerouslySetInnerHTML={{ __html: text }}></span>}
                    </Editable>
                    <h2>{t('schedule_title')}</h2>
                    <p className="description">{t('schedule_desc')}</p>
                </div>

                <div className={`schedule-modern-grid ${visibleSchedule.length === 1 ? 'is-single' : ''}`} id="schedule-container">
                    {visibleSchedule.map((item) => (
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
                                    <span className="day-text">{getDay(item)}</span>
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

export default Schedule;
