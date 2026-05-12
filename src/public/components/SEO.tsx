import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  lang?: string;
  type?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  lang = 'ko',
  type = 'website',
  url = 'https://nkhb.org',
}) => {
  const siteTitle = '뉴코리아 희망방송 (NKHB)';
  const defaultDescription = '뉴코리아 희망방송(NKHB)은 라디오 전파를 통해 북한 주민들에게 희망과 진실, 그리고 복음을 전하는 대북 라디오 방송입니다.';
  const defaultImage = 'images/main-hero.png';

  const seoTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <html lang={lang} />

      {/* Open Graph tags */}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};

export default SEO;