import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';

interface SEOProps {
  slug: string;
}

interface SEOData {
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  keywords_ko?: string;
  keywords_en?: string;
  og_image_url?: string;
}

const SEO: React.FC<SEOProps> = ({ slug }) => {
  const { lang } = useI18n();
  const [data, setData] = useState<SEOData | null>(null);

  useEffect(() => {
    const fetchSEO = async () => {
      // 1. Try to fetch from seo_settings first
      const { data: seoData, error: seoError } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_slug', slug)
        .single();

      if (!seoError && seoData) {
        setData(seoData);
      } else {
        // 2. If not found, try to fetch from pages table (for dynamic sub-pages)
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('title_ko, title_en, content_ko, content_en')
          .eq('slug', slug)
          .single();

        if (!pageError && pageData) {
          setData({
            title_ko: `${pageData.title_ko} | 뉴코리아 희망방송`,
            title_en: `${pageData.title_en} | NKHB`,
            description_ko: pageData.content_ko?.substring(0, 160).replace(/<[^>]*>/g, '') || '',
            description_en: pageData.content_en?.substring(0, 160).replace(/<[^>]*>/g, '') || '',
          });
        }
      }
    };
    fetchSEO();
  }, [slug]);

  if (!data) return null;

  const title = lang === 'ko' ? data.title_ko : data.title_en;
  const description = lang === 'ko' ? data.description_ko : data.description_en;
  const keywords = lang === 'ko' ? data.keywords_ko : data.keywords_en;
  const ogImage = data.og_image_url || 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png';
  const siteUrl = 'https://nkhb.org';
  const currentUrl = `${siteUrl}${window.location.pathname === '/' ? '' : window.location.pathname}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": slug === 'home' ? "Organization" : "WebPage",
    "name": "뉴코리아 희망방송 (NKHB)",
    "url": siteUrl,
    "logo": "https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png",
    "description": description,
    "sameAs": [
        "https://nkfi.org"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      
      <link rel="alternate" href={currentUrl} hrefLang="ko" />
      <link rel="alternate" href={currentUrl} hrefLang="en" />
      <link rel="alternate" href={currentUrl} hrefLang="x-default" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="뉴코리아 희망방송 (NKHB)" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={lang === 'ko' ? 'ko_KR' : 'en_US'} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
