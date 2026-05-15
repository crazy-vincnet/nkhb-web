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
