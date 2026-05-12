import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import translations from lang.js
// Since lang.js is not exported, we might need to read it and eval or modify it
const langJsPath = path.resolve(__dirname, '../lang.js');
const langJsContent = fs.readFileSync(langJsPath, 'utf-8');
// Simple way to get the translations object
const translationsMatch = langJsContent.match(/const translations = ({[\s\S]*?});/);
if (!translationsMatch) {
    console.error('Could not find translations in lang.js');
    process.exit(1);
}

// Use a safer way to parse the object if possible, or just eval for this script
let translations;
try {
    // This is a bit hacky but works for a one-time migration script
    const evalContent = langJsContent.replace('const translations =', 'export const translations =');
    const tempFile = path.resolve(__dirname, './temp_translations.js');
    fs.writeFileSync(tempFile, evalContent);
    const module = await import('./temp_translations.js');
    translations = module.translations;
    fs.unlinkSync(tempFile);
} catch (e) {
    console.error('Failed to parse translations:', e);
    process.exit(1);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createHomeLayout = (t) => {
    return [
        {
            type: 'nkhb-hero',
            attributes: {
                tag_ko: t.ko.hero_tag,
                tag_en: t.en.hero_tag,
                title_ko: t.ko.hero_title,
                title_en: t.en.hero_title,
                subtitle_ko: t.ko.hero_subtitle,
                subtitle_en: t.en.hero_subtitle,
            }
        },
        {
            type: 'nkhb-background',
            attributes: {
                title_ko: t.ko.background_title,
                title_en: t.en.background_title,
                desc1_ko: t.ko.background_desc1,
                desc1_en: t.en.background_desc1,
                desc2_ko: t.ko.background_desc2,
                desc2_en: t.en.background_desc2,
                desc3_ko: t.ko.background_desc3,
                desc3_en: t.en.background_desc3,
                quote_ko: t.ko.background_quote,
                quote_en: t.en.background_quote,
            }
        },
        {
            type: 'nkhb-composition',
            attributes: {
                title_ko: t.ko.composition_title,
                title_en: t.en.composition_title,
                desc_ko: t.ko.composition_desc,
                desc_en: t.en.composition_desc,
            }
        },
        {
            type: 'nkhb-effects',
            attributes: {
                title_ko: t.ko.effects_title,
                title_en: t.en.effects_title,
                desc_ko: t.ko.effects_desc,
                desc_en: t.en.effects_desc,
            }
        },
        {
            type: 'nkhb-quote',
            attributes: {
                text_ko: t.ko.quote_banner_text,
                text_en: t.en.quote_banner_text,
            }
        },
        {
            type: 'nkhb-reach',
            attributes: {
                title_ko: t.ko.reach_title,
                title_en: t.en.reach_title,
                desc_ko: t.ko.reach_desc,
                desc_en: t.en.reach_desc,
            }
        },
        {
            type: 'nkhb-guide',
            attributes: {
                title_ko: t.ko.guide_title,
                title_en: t.en.guide_title,
                desc_ko: t.ko.guide_desc,
                desc_en: t.en.guide_desc,
            }
        },
        {
            type: 'nkhb-support',
            attributes: {
                title_ko: t.ko.support_title,
                title_en: t.en.support_en_title,
                desc_ko: t.ko.support_desc,
                desc_en: t.en.support_desc,
            }
        },
        {
            type: 'nkhb-schedule',
            attributes: {
                title_ko: t.ko.schedule_title,
                title_en: t.en.schedule_title,
                desc_ko: t.ko.schedule_desc,
                desc_en: t.en.schedule_desc,
            }
        }
    ];
};

const createAboutLayout = (t) => {
    return [
        {
            type: 'nkhb-hero',
            attributes: {
                title_ko: t.ko.about_hero_title,
                title_en: t.en.about_hero_title,
                subtitle_ko: t.ko.about_hero_subtitle,
                subtitle_en: t.en.about_hero_subtitle,
            }
        },
        {
            type: 'nkhb-about-intro',
            attributes: {
                top_text_ko: t.ko.about_intro_top,
                top_text_en: t.en.about_intro_top,
                title_ko: t.ko.about_intro_title,
                title_en: t.en.about_intro_title,
                p1_ko: t.ko.about_intro_p1,
                p1_en: t.en.about_intro_p1,
                p2_ko: t.ko.about_intro_p2,
                p2_en: t.en.about_intro_p2,
                info1_ko: t.ko.about_intro_info1,
                info1_en: t.en.about_intro_info1,
                info2_ko: t.ko.about_intro_info2,
                info2_en: t.en.about_intro_info2,
                info3_ko: t.ko.about_intro_info3,
                info3_en: t.en.about_intro_info3,
                image_url: '/images/poster.png'
            }
        },
        {
            type: 'nkhb-about-values',
            attributes: {
                vision_title_ko: t.ko.about_vision_title,
                vision_title_en: t.en.about_vision_title,
                vision_desc_ko: t.ko.about_vision_desc,
                vision_desc_en: t.en.about_vision_desc,
                mission_title_ko: t.ko.about_mission_title,
                mission_title_en: t.en.about_mission_title,
                mission_desc_ko: t.ko.about_mission_desc,
                mission_desc_en: t.en.about_mission_desc,
                mission_li1_ko: t.ko.about_mission_li1,
                mission_li1_en: t.en.about_mission_li1,
                mission_li2_ko: t.ko.about_mission_li2,
                mission_li2_en: t.en.about_mission_li2,
                mission_li3_ko: t.ko.about_mission_li3,
                mission_li3_en: t.en.about_mission_li3,
                mission_li4_ko: t.ko.about_mission_li4,
                mission_li4_en: t.en.about_mission_li4,
                mission_li5_ko: t.ko.about_mission_li5,
                mission_li5_en: t.en.about_mission_li5,
                mission_li6_ko: t.ko.about_mission_li6,
                mission_li6_en: t.en.about_mission_li6,
            }
        },
        {
            type: 'nkhb-about-ministry',
            attributes: {
                title_ko: t.ko.about_ministry_title,
                title_en: t.en.about_ministry_title,
                card1_title_ko: t.ko.about_ministry_card1_title,
                card1_title_en: t.en.about_ministry_card1_title,
                card1_desc_ko: t.ko.about_ministry_card1_desc,
                card1_desc_en: t.en.about_ministry_card1_desc,
                card2_title_ko: t.ko.about_ministry_card2_title,
                card2_title_en: t.en.about_ministry_card2_title,
                card2_desc_ko: t.ko.about_ministry_card2_desc,
                card2_desc_en: t.en.about_ministry_card2_desc,
                card3_title_ko: t.ko.about_ministry_card3_title,
                card3_title_en: t.en.about_ministry_card3_title,
                card3_desc_ko: t.ko.about_ministry_card3_desc,
                card3_desc_en: t.en.about_ministry_card3_desc,
                card4_title_ko: t.ko.about_ministry_card4_title,
                card4_title_en: t.en.about_ministry_card4_title,
                card4_desc_ko: t.ko.about_ministry_card4_desc,
                card4_desc_en: t.en.about_ministry_card4_desc,
            }
        },
        {
            type: 'nkhb-about-founder',
            attributes: {
                title_ko: t.ko.about_founder_title,
                title_en: t.en.about_founder_title,
                desc_title_ko: t.ko.about_founder_desc_title,
                desc_title_en: t.en.about_founder_desc_title,
                profile1_ko: t.ko.about_founder_profile1,
                profile1_en: t.en.about_founder_profile1,
                profile2_ko: t.ko.about_founder_profile2,
                profile2_en: t.en.about_founder_profile2,
                profile3_ko: t.ko.about_founder_profile3,
                profile3_en: t.en.about_founder_profile3,
                profile4_ko: t.ko.about_founder_profile4,
                profile4_en: t.en.about_founder_profile4,
                profile5_ko: t.ko.about_founder_profile5,
                profile5_en: t.en.about_founder_profile5,
                profile6_ko: t.ko.about_founder_profile6,
                profile6_en: t.en.about_founder_profile6,
                book_ko: t.ko.about_founder_book,
                book_en: t.en.about_founder_book,
                image_url: '/images/kenneth-bae.png'
            }
        },
        {
            type: 'nkhb-about-cta',
            attributes: {
                title_ko: t.ko.about_cta_title,
                title_en: t.en.about_cta_title,
                website_button_ko: t.ko.about_cta_website,
                website_button_en: t.en.about_cta_website,
                home_button_ko: t.ko.about_cta_home,
                home_button_en: t.en.about_cta_home,
            }
        }
    ];
};

async function migrate() {
    console.log('Starting migration...');

    const homePage = {
        slug: 'home',
        layout_json: createHomeLayout(translations),
        seo_title_ko: translations.ko.page_title,
        seo_title_en: translations.en.page_title,
        seo_description_ko: translations.ko.meta_description,
        seo_description_en: translations.en.meta_description,
    };

    const aboutPage = {
        slug: 'about',
        layout_json: createAboutLayout(translations),
        seo_title_ko: translations.ko.nav_about,
        seo_title_en: translations.en.nav_about,
        seo_description_ko: translations.ko.about_hero_subtitle,
        seo_description_en: translations.en.about_hero_subtitle,
    };

    const { data, error } = await supabase
        .from('cms_pages')
        .upsert([homePage, aboutPage], { onConflict: 'slug' });

    if (error) {
        console.error('Migration failed:', error);
    } else {
        console.log('Migration successful!');
    }
}

migrate();
