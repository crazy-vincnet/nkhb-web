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
        // Meta & SEO
        meta_description: "New Korea Hope Broadcasting (NKHB) is a radio station that delivers hope, truth, and the gospel to the people of North Korea through radio waves.",
        page_title: "New Korea Hope Broadcasting (NKHB)",
        nav_background: "Background",
        nav_composition: "Program",
        nav_effects: "Impact",
        nav_reach: "Reach",
        nav_guide: "Get Involved",
        nav_support: "Donate",
        nav_schedule: "Schedule",
        nav_about: "About Us",
        hero_tag: "North Korea Hope Broadcasting(NKHB)",
        hero_title: "In the Night of North Korea</br>We Bring Truth and Hope",
        hero_subtitle: "“The truth will set you free.”",
        hero_button_about: "Learn More",
        hero_button_letter: "Send a Letter of Hope",
        background_title: "Why is Radio Broadcasting Necessary?",
        background_desc1: "Today, approximately 25 million North Koreans live cut off from the outside world.",
        background_quote: '"During his 735 days of captivity, Kenneth Bae gained strength from over 400 letters sent from around the world."',
        background_desc2: "New Korea Hope Broadcasting (NKHB) was started to once again bring hope, truth, and the gospel to the North Korean people.",
        background_desc3: "In North Korean society, radio remains the most realistic and effective means of information transmission.",
        background_read_more: "Read More About the Role of North Korean Broadcasts →",
        background_about_nkfi: "About NKFI →",
        background_testimonial_tag: "44% of North Korean defectors have listened to the radio",
        background_testimonial_text: '"I came to know the world through the radio"',
        composition_title: "Program Structure",
        composition_desc: "NKHB produces and broadcasts content tailored to the realities and needs of North Koreans.",
        composition_button_sample: "🎙️ Sample Listen",
        composition_card1_title: "Hope",
        composition_card1_desc: '"Letter of Hope" - Delivers encouraging messages from around the world.',
        composition_card2_title: "Truth",
        composition_card2_desc: "Conveys comfort and spiritual truth through Bible stories.",
        composition_card3_title: "Facts",
        composition_card3_desc: "Objectively delivers hidden truths such as changes in the outside world.",
        composition_card4_title: "Restoration",
        composition_card4_desc: "Heals the hearts of residents through the leisure of a piece of music.",
        effects_title: "Expected Impact",
        effects_desc: "The message from a single radio can bring about amazing changes.",
        effects_card1_title: "Change in Perception",
        effects_card1_desc: "North Koreans come to realize that 'the world they know is not everything.'",
        effects_card2_title: "Weakening of Fear",
        effects_card2_desc: "By encountering outside information, they gradually break free from fear.",
        effects_card3_title: "Preparing for the Future",
        effects_card3_desc: "Through an understanding of freedom, human rights, and the economy.",
        effects_card4_title: "Spiritual Awakening",
        effects_card4_desc: "Shares the hope and love of Jesus Christ.",
        effects_card5_title: "Relief from Isolation",
        effects_card5_desc: "Gains emotional stability and comfort.",
        quote_banner_text: '"For that one person in the deep North Korean night, listening closely to a small radio, please join NKHB."',
        reach_title: "Across Borders, to the World<br>The Voice of Truth Spreads",
        reach_desc: "This broadcast is spreading across borders.",
        reach_details2: "Truth, hope, and the gospel are spreading across borders at this very moment.",
        reach_feature1: "Reception reports completed for all of North Korea and neighboring countries.",
        reach_feature2: "Reception confirmed in over 10 countries worldwide.",
        reach_feature3: "Broadcast delivered to overseas workers and North Korean refugees.",
        guide_title: "Get Involved",
        guide_desc: "Your warm interest and participation become a light of life for the people of North Korea.",
        guide_letter_title: "✍️ Send a Letter of Hope",
        guide_letter_intro: "NKHB has a corner called <strong>'Letter of Hope.'</strong>",
        guide_letter_notice: "📢 This corner is <strong>broadcast daily,</strong> so we need a lot of participation.",
        guide_step1_title: "Write a Message",
        guide_step1_desc: "Feel free to write messages of comfort and encouragement.",
        guide_step2_title: "Send by Email",
        guide_step2_desc: "Please send your message to our official email address.",
        guide_step3_title: "Broadcast",
        guide_step3_desc: "It will be broadcast throughout North Korea in the voice of a defector.",
        guide_contact_title: "Where to Send Letters",
        guide_button_write: "Write a Letter of Hope",
        guide_writing_title: "Writing Guide",
        guide_contact_note: "* Even if written in a language other than Korean, it will be translated.",
        support_title: "Support",
        support_desc: "Please become a radio wave missionary spreading truth and hope.",
        support_account_title: "Donation Account Information",
        support_account_bank: "KEB Hana Bank",
        support_account_holder: "Account Holder: New Korea Foundation International",
        footer_contact: "NKHB | Contact: nkhb316@gmail.com",
        footer_schedule: "Mon·Wed·Fri 02:30-03:00 (5920 kHz)",
        footer_copyright: "&copy; 2026 New Korea Hope Broadcasting. All rights reserved.",
        logo_url: "https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png",
        image_hero_bg: "/images/main-hero.png",
        image_background_section: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_reach_map: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_about_poster: "/images/poster.png",
        image_about_kenneth: "/images/kenneth-bae.png",
    },
    ko: {
        meta_description: "뉴코리아 희망방송(NKHB)은 라디오 전파를 통해 북한 주민들에게 희망과 진실, 그리고 복음을 전하는 대북 라디오 방송입니다.",
        page_title: "뉴코리아 희망방송 (NKHB)",
        nav_background: "방송배경",
        nav_composition: "방송구성",
        nav_effects: "기대효과",
        nav_reach: "방송 도달 범위",
        nav_guide: "참여 안내",
        nav_support: "후원하기",
        nav_schedule: "방송시간",
        nav_about: "NKFI 소개",
        hero_tag: "뉴코리아 희망방송(NKHB)",
        hero_title: "북한의 밤에</br>진실과 희망을 전합니다",
        hero_subtitle: "“진리가 너희를 자유케 하리니”",
        hero_button_about: "방송소개 보기",
        hero_button_letter: "희망의 편지 보내기",
        background_title: "왜 라디오 방송이 필요한가",
        background_desc1: "오늘날 약 2,500만 명의 북한 주민들은 외부 세계와 단절된 채 살아가고 있습니다.",
        background_quote: '"케네스 배 선교사는 억류 기간 동안 보내온 편지를 통해 힘을 얻었습니다. NKHB는 그 희망의 메시지를 전하기 위해 시작되었습니다."',
        background_desc2: "뉴코리아 희망방송(NKHB)은 북한 주민들에게 다시금 희망과 진실을 전하기 위해 시작되었습니다.",
        background_desc3: "북한 사회에서 라디오는 여전히 가장 효과적인 정보 전달 수단입니다.",
        background_read_more: "대북방송의 역할 자세히 읽기 →",
        background_about_nkfi: "NKFI 소개 →",
        background_testimonial_tag: "탈북민 라디오 청취 경험 44%",
        background_testimonial_text: '"라디오를 통해 세상을 알게 되었습니다"',
        composition_title: "방송 구성",
        composition_desc: "NKHB는 북한 주민의 현실과 필요를 반영한 맞춤형 콘텐츠를 제작합니다.",
        composition_button_sample: "🎙️ 샘플듣기",
        composition_card1_title: "희망",
        composition_card1_desc: '"희망의 편지" - 전 세계 격려 메시지와 탈북민의 생생한 이야기를 전합니다.',
        composition_card2_title: "진리",
        composition_card2_desc: "성경 이야기와 복음을 통해 영적인 진리를 전달합니다.",
        composition_card3_title: "진실",
        composition_card3_desc: "외부 세계의 변화와 국제 소식 등 을 객관적으로 전달합니다.",
        composition_card4_title: "회복",
        composition_card4_desc: "음악 한 곡의 여유와 심리 치유 콘텐츠로 마음을 회복시킵니다.",
        effects_title: "기대 효과",
        effects_desc: "라디오 한 대가 전하는 메시지는 놀라운 변화를 일으킵니다.",
        effects_card1_title: "인식의 변화",
        effects_card1_desc: "지금 알고 있는 세상이 전부가 아니다는 사실을 깨닫게 됩니다.",
        effects_card2_title: "두려움의 약화",
        effects_card2_desc: "외부 정보를 접하면서 절대적인 두려움에서 벗어나게 됩니다.",
        effects_card3_title: "미래 준비",
        effects_card3_desc: "자유, 인권, 경제에 대한 이해를 통해 통일 이후를 준비합니다.",
        effects_card4_title: "영적 각성",
        effects_card4_desc: "예수 그리스도의 소망과 사랑을 전합니다.",
        effects_card5_title: "고립감 해소",
        effects_card5_desc: "외부 세계와 연결되어 있다는 느낌을 통해 위로를 얻습니다.",
        quote_banner_text: '"북한의 깊은 밤, 작은 라디오에 귀를 기울이고 있을 한 사람을 위해 뉴코리아 희망방송과 함께해 주십시오."',
        reach_title: "국경을 넘어 전 세계로<br>퍼져나가는 진실의 목소리",
        reach_desc: "이 방송은 국경을 넘어 퍼져가고 있습니다.",
        reach_details2: "진실과 희망, 그리고 복음은 지금 이 순간에도 국경을 넘어 퍼져가고 있습니다.",
        reach_feature1: "북한 전 지역 및 주변국 수신 보고 완료",
        reach_feature2: "유럽, 남미 등 전 세계 10개국 이상 수신 확인",
        reach_feature3: "해외 노동자 및 탈북 난민에게도 방송 전달",
        guide_title: "함께 참여하기",
        guide_desc: "여러분의 따뜻한 관심과 참여가 북한 주민들에게는 생명의 빛이 됩니다.",
        guide_letter_title: "✍️ 희망의 편지 보내기",
        guide_letter_intro: "NKHB에는 <strong>'희망의 편지'</strong>라는 코너가 있습니다.",
        guide_letter_notice: "📢 이 코너는 <strong>매일 방송</strong>되기 때문에 많은 참여가 필요합니다.",
        guide_step1_title: "메시지 작성",
        guide_step1_desc: "위로와 격려의 메시지를 자유롭게 적어주세요.",
        guide_step2_title: "이메일 발송",
        guide_step2_desc: "공식 이메일 주소로 메시지를 보내주세요.",
        guide_step3_title: "방송 송출",
        guide_step3_desc: "탈북민의 목소리로 북한 전역에 방송됩니다.",
        guide_contact_title: "편지 보내실 곳",
        guide_button_write: "희망의 편지 작성하기",
        guide_writing_title: "작성 안내",
        guide_contact_note: "* 한국어 외 다른 언어로 작성하셔도 한국어로 번역되어 방송됩니다.",
        support_title: "후원하기",
        support_desc: "북한 주민들에게 진실과 희망을 전하는 전파 선교사가 되어 주세요.",
        support_account_title: "후원 계좌 안내",
        support_account_bank: "KEB 하나은행",
        support_account_holder: "예금주: 뉴코리아 파운데이션 인터내셔널",
        footer_contact: "뉴코리아 희망방송 (NKHB) | 연락처: nkhb316@gmail.com",
        footer_schedule: "월·수·금 02:30 (5920 kHz) / 화·목·토 23:00 (9470 kHz)",
        footer_copyright: "&copy; 2026 뉴코리아 희망방송. All rights reserved.",
        logo_url: "https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png",
        image_hero_bg: "/images/main-hero.png",
        image_background_section: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_reach_map: "https://cdn.imweb.me/thumbnail/20260424/ae13dd489d8ac.png",
        image_about_poster: "/images/poster.png",
        image_about_kenneth: "/images/kenneth-bae.png",
    }
};

const applyTheme = (theme: any) => {
  const root = document.documentElement;
  if (!theme) return;
  
  const mapping: Record<string, string> = {
    '--accent-color': theme.colors?.accent,
    '--accent-light': theme.colors?.accentLight,
    '--primary-color': theme.colors?.primary,
    '--secondary-color': theme.colors?.secondary,
    '--text-main': theme.colors?.textMain,
    '--section-padding': theme.ui?.sectionPadding,
    '--border-radius-lg': theme.ui?.borderRadius,
    '--max-width': theme.ui?.maxWidth
  };

  Object.entries(mapping).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('ko');
  const [dbContent, setDbContent] = useState<any[]>([]);
  const [liveChanges, setLiveChanges] = useState<Record<string, Partial<ContentData>>>({});
  const [loading, setLoading] = useState(true);

  const detectLanguage = useCallback(() => {
    // 1. Detect from URL path (e.g., /en, /en/about)
    const path = window.location.pathname.toLowerCase();
    const isEnPath = path === '/en' || path.startsWith('/en/');
    
    // 2. Detect from Query Parameter (e.g., ?lang=en)
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang')?.toLowerCase();
    const isEnParam = langParam === 'en';
    
    // 3. Fallback to saved preference
    const savedLang = localStorage.getItem('lang') as Language;
    
    if (isEnPath || isEnParam) {
      if (lang !== 'en') setLangState('en');
    } else if (savedLang && lang !== savedLang) {
      setLangState(savedLang);
    }
  }, [lang]);

  useEffect(() => {
    detectLanguage();
    fetchContent();

    // Listen for path changes (SPA or manual)
    window.addEventListener('popstate', detectLanguage);
    
    const handleMessage = (event: MessageEvent) => {
      // ... same message handler logic
      if (event.data?.type === 'NKHB_LIVE_UPDATE') {
        const { key, data } = event.data;
        setLiveChanges(prev => ({
          ...prev,
          [key]: { ...prev[key], ...data }
        }));
      } else if (event.data?.type === 'NKHB_LIVE_THEME_UPDATE') {
        const { theme } = event.data;
        setLiveChanges(prev => ({
          ...prev,
          'global_theme_settings': { styles: theme }
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (liveChanges['global_theme_settings']?.styles) {
      applyTheme(liveChanges['global_theme_settings'].styles);
    }
  }, [liveChanges]);

  const fetchContent = async () => {
    try {
      const { data } = await supabase.from('content').select('*');
      if (data) {
        setDbContent(data);
        const themeItem = data.find(i => i.key === 'global_theme_settings');
        if (themeItem?.style_props) applyTheme(themeItem.style_props);
      }
    } finally {
      setLoading(false);
    }
  };

  const getContent = useCallback((key: string): ContentData => {
    const item = dbContent.find(i => i.key === key);
    const live = liveChanges[key];

    const baseText = lang === 'ko' ? (item?.value_ko || (staticTranslations as any).ko?.[key]) : (item?.value_en || (staticTranslations as any).en?.[key]);
    
    // CRITICAL: Only apply styles that are explicitly set in DB or Live Changes.
    // Do NOT include default computed styles here to avoid overriding CSS classes.
    const dbStyles = item?.style_props || {};
    const liveStyles = live?.styles || {};
    
    // Filter out empty strings/nulls to let CSS classes take over
    const activeStyles = { ...dbStyles, ...liveStyles };
    const styles: React.CSSProperties = {};
    Object.keys(activeStyles).forEach(k => {
        if (activeStyles[k] && k !== 'link') (styles as any)[k] = activeStyles[k];
    });

    // Support bilingual links and assets (e.g. logo_ko.png and logo_en.png)
    const baseLink = lang === 'ko' ? item?.value_ko : item?.value_en;
    const hasDbAsset = !!baseLink;

    // Only fallback to static translations if it looks like a URL or a known link key
    const staticLink = (staticTranslations as any).en?.[key] || (staticTranslations as any).ko?.[key];
    const isUrl = typeof staticLink === 'string' && (staticLink.startsWith('http') || staticLink.startsWith('/') || staticLink.startsWith('#'));

    // Priority for links/assets:
    // 1. Live unsaved changes (live.link)
    // 2. Explicit DB asset for current language (baseLink)
    // 3. Fallback link in style_props.link
    // 4. Static fallback if key is a URL
    let finalLink = live?.link;
    if (!finalLink) {
        if (hasDbAsset) finalLink = baseLink;
        else if (dbStyles.link) finalLink = dbStyles.link;
        else if (isUrl) finalLink = staticLink;
        else finalLink = baseLink; // last resort
    }

    return {
      text: (live?.text ?? baseText) || key,
      styles,
      link: finalLink
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
