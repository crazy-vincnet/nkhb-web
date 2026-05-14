import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from './supabase';

type Language = 'ko' | 'en';

interface ContentData {
  text: string;
  styles: React.CSSProperties;
  link?: string;
}

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  getContent: (key: string) => ContentData;
  updateLiveStyle: (key: string, data: Partial<ContentData>) => void;
  loading: boolean;
}

const staticTranslations = {
  en: {
    hero_title: "In the Night of North Korea</br>We Bring Truth and Hope",
    hero_subtitle: "“The truth will set you free.”",
    // ... rest of static translations (omitted for brevity in this step)
  },
  ko: {
    hero_title: "북한의 밤에</br>진실과 희망을 전합니다",
    hero_subtitle: "“진리가 너희를 자유케 하리니”",
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('ko');
  const [dbContent, setDbContent] = useState<any[]>([]);
  const [liveChanges, setLiveChanges] = useState<Record<string, Partial<ContentData>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('lang') as Language;
    if (savedLang) setLangState(savedLang);
    fetchContent();

    // Listen for live preview messages from Admin Parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NKHB_LIVE_UPDATE') {
        const { key, data } = event.data;
        setLiveChanges(prev => ({
          ...prev,
          [key]: { ...prev[key], ...data }
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchContent = async () => {
    try {
      const { data } = await supabase.from('content').select('*');
      if (data) setDbContent(data);
    } finally {
      setLoading(false);
    }
  };

  const getContent = useCallback((key: string): ContentData => {
    const item = dbContent.find(i => i.key === key);
    const live = liveChanges[key];

    const baseText = lang === 'ko' ? (item?.value_ko || (staticTranslations as any).ko?.[key]) : (item?.value_en || (staticTranslations as any).en?.[key]);
    const baseStyles = item?.style_props || {};
    
    return {
      text: (live?.text ?? baseText) || key,
      styles: { ...baseStyles, ...live?.styles },
      link: live?.link ?? baseStyles.link ?? item?.link_url
    };
  }, [dbContent, liveChanges, lang]);

  const t = (key: string): string => getContent(key).text;

  const updateLiveStyle = (key: string, data: Partial<ContentData>) => {
    setLiveChanges(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
  };

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, getContent, updateLiveStyle, loading }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
