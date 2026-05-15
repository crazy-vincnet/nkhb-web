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
