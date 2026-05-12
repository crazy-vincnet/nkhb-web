import DOMPurify from "dompurify";
import React from 'react';
import Hero from './Hero';
import Background from './Background';
import Composition from './Composition';
import Effects from './Effects';
import QuoteBanner from './QuoteBanner';
import Reach from './Reach';
import Guide from './Guide';
import Support from './Support';
import SupportEn from './SupportEn';
import Schedule from './Schedule';
import { useI18n } from '../lib/i18n';

interface CMSPageRendererProps {
  layout: any;
  onOpenArticle?: () => void;
  onOpenSample?: () => void;
  onOpenLetter?: () => void;
}

const CMSPageRenderer: React.FC<CMSPageRendererProps> = ({
  layout,
  onOpenArticle,
  onOpenSample,
  onOpenLetter,
}) => {
  const { lang } = useI18n();

  const renderComponent = (component: any): React.ReactNode => {
    if (!component) return null;

    const { type, tagName, components: subComponents, content, ...props } = component;

    const children = subComponents?.map((child: any, i: number) => (
      <React.Fragment key={i}>{renderComponent(child)}</React.Fragment>
    ));

    // Map GrapesJS component types to our React components
    switch (type) {
      case 'nkhb-hero':
        return <Hero key="hero" {...props} />;
      case 'nkhb-background':
        return <Background key="background" onOpenArticle={onOpenArticle} {...props} />;
      case 'nkhb-composition':
        return <Composition key="composition" onOpenSample={onOpenSample} {...props} />;
      case 'nkhb-effects':
        return <Effects key="effects" {...props} />;
      case 'nkhb-quote':
        return <QuoteBanner key="quote-banner" {...props} />;
      case 'nkhb-reach':
        return <Reach key="reach" {...props} />;
      case 'nkhb-guide':
        return <Guide key="guide" onOpenLetter={onOpenLetter} {...props} />;
      case 'nkhb-support':
        return lang === 'ko' ? <Support key="support" {...props} /> : <SupportEn key="support-en" {...props} />;
      case 'nkhb-schedule':
        return <Schedule key="schedule" {...props} />;
      case 'nkhb-about-intro':
        // We'll need to create or update components to handle these props
        return <div className="nkhb-about-intro" {...props}>About Intro (CMS)</div>;
      case 'nkhb-about-values':
        return <div className="nkhb-about-values" {...props}>About Values (CMS)</div>;
      case 'nkhb-about-ministry':
        return <div className="nkhb-about-ministry" {...props}>About Ministry (CMS)</div>;
      case 'nkhb-about-founder':
        return <div className="nkhb-about-founder" {...props}>About Founder (CMS)</div>;
      case 'nkhb-about-cta':
        return <div className="nkhb-about-cta" {...props}>About CTA (CMS)</div>;
      case 'text':
        const TextTag = (tagName || 'div') as any;
        return <TextTag key={props.id || Math.random()} {...props} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content || "") }} />;
      default:
        const Tag = (tagName || 'div') as any;
        if (children && children.length > 0) {
          return <Tag key={props.id || Math.random()} {...props}>{children}</Tag>;
        }
        if (content) {
          return <Tag key={props.id || Math.random()} {...props} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content || "") }} />;
        }
        return <Tag key={props.id || Math.random()} {...props} />;
    }
  };

  return <>{renderComponent(layout)}</>;
};

export default CMSPageRenderer;

