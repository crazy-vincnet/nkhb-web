import React from 'react';
import SEO from '../components/SEO';
import { useI18n } from '../lib/i18n';
import { ABOUT_SECTION_MAP, ABOUT_DEFAULT_LAYOUT } from '../lib/registry';

const About: React.FC = () => {
    const { getContent } = useI18n();

    const layoutData = getContent('page_layout_about');
    const layout = Array.isArray(layoutData.order)
        ? layoutData.order
        : ABOUT_DEFAULT_LAYOUT;

    return (
        <div className="about-page">
            <SEO slug="about" />
            <main className="about-content">
                {layout.map((key: string) => {
                    const Component = ABOUT_SECTION_MAP[key];
                    if (!Component) return null;
                    return <Component key={key} />;
                })}
            </main>
        </div>
    );
};

export default About;
