import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';
import DOMPurify from 'dompurify';
import SEO from '../components/SEO';

interface PageData {
  slug: string;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
}

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useI18n();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        setPage(data);
      } else {
        setPage(null);
      }
      setLoading(false);
    };

    if (slug) fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const title = lang === 'ko' ? page.title_ko : page.title_en;
  const content = lang === 'ko' ? page.content_ko : page.content_en;

  // Check if it's GrapesJS content (usually contains <style> or specific structures)
  const isVisualDesign = content?.includes('<style>') || content?.includes('gjs-');

  return (
    <div className="dynamic-page pt-20 pb-0 overflow-hidden">
      <SEO slug={page.slug} />
      
      {/* Standard Header only for non-visual designs */}
      {!isVisualDesign && (
        <div className="container mx-auto px-4 max-w-4xl pt-12 mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
      )}

      <div 
        className={`grapesjs-content-wrapper ${!isVisualDesign ? 'container mx-auto px-4 max-w-4xl pb-20' : ''}`}
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(content || '', {
            ADD_TAGS: ['style'], 
            FORCE_BODY: true
          }) 
        }}
      />
    </div>
  );
};

export default DynamicPage;
