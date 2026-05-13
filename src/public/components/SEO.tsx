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
  keywords_ko: string;
  keywords_en: string;
  og_image_url: string;
}

const SEO: React.FC<SEOProps> = ({ slug }) => {
  const { lang } = useI18n();
  const [data, setData] = useState<SEOData | null>(null);

  useEffect(() => {
    const fetchSEO = async () => {
      const { data: seoData, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('page_slug', slug)
        .single();

      if (!error && seoData) {
        setData(seoData);
      }
    };
    fetchSEO();
  }, [slug]);

  if (!data) return null;

  const title = lang === 'ko' ? data.title_ko : data.title_en;
  const description = lang === 'ko' ? data.description_ko : data.description_en;
  const keywords = lang === 'ko' ? data.keywords_ko : data.keywords_en;
  const ogImage = data.og_image_url || 'https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png'; // Default logo as fallback

  return (
    <Helmet>
      {/* Standard tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
