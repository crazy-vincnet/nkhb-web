import Hero from '../components/Hero';
import Background from '../components/Background';
import Composition from '../components/Composition';
import Effects from '../components/Effects';
import QuoteBanner from '../components/QuoteBanner';
import Reach from '../components/Reach';
import Guide from '../components/Guide';
import Support from '../components/Support';
import SupportEn from '../components/SupportEn';
import Schedule from '../components/Schedule';
import { 
    AboutHero, 
    AboutIntro, 
    AboutVision, 
    AboutMinistry, 
    AboutFounder, 
    AboutCTA 
} from '../components/AboutSections';

export const HOME_SECTION_MAP: Record<string, any> = {
    hero: Hero,
    background: Background,
    composition: Composition,
    effects: Effects,
    quote: QuoteBanner,
    reach: Reach,
    guide: Guide,
    support: Support,
    support_en: SupportEn,
    schedule: Schedule
};

export const HOME_DEFAULT_LAYOUT = [
    "hero", "background", "composition", "effects", "quote", "reach", "guide", "support", "schedule"
];

export const ABOUT_SECTION_MAP: Record<string, any> = {
    about_hero: AboutHero,
    about_intro: AboutIntro,
    about_vision: AboutVision,
    about_ministry: AboutMinistry,
    about_founder: AboutFounder,
    about_cta: AboutCTA
};

export const ABOUT_DEFAULT_LAYOUT = [
    "about_hero", "about_intro", "about_vision", "about_ministry", "about_founder", "about_cta"
];

export const SECTION_LABELS: Record<string, string> = {
    hero: '히어로 배너',
    background: '방송 배경',
    composition: '방송 구성',
    effects: '방송 효과',
    quote: '인용 배너',
    reach: '방송 범위',
    guide: '청취 안내',
    support: '후원 안내 (KO)',
    support_en: '후원 안내 (EN)',
    schedule: '방송 시간표',
    about_hero: '소개 히어로',
    about_intro: '소개 서문',
    about_vision: '비전 및 사명',
    about_ministry: '사역 소개',
    about_founder: '설립자 소개',
    about_cta: '소개 하단 CTA'
};
