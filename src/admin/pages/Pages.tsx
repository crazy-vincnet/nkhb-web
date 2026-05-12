import React, { useState, useEffect } from 'react';
import { getPage, CMSPageData } from '../lib/cms';
import Editor from '../components/GrapesEditor/Editor';
import { FileText, ChevronRight, Loader2 } from 'lucide-react';

const PAGES = [
  { slug: 'home', title: 'Home Page' },
  { slug: 'about', title: 'About Page' },
];

const Pages: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pageData, setPageData] = useState<CMSPageData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSlug) {
      fetchPageData(selectedSlug);
    }
  }, [selectedSlug]);

  const fetchPageData = async (slug: string) => {
    setLoading(true);
    try {
      const data = await getPage(slug);
      if (data) {
        setPageData(data);
      } else {
        // Initialize new page data if not found
        setPageData({
          slug,
          layout_json: null,
        });
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedSlug && pageData) {
    return (
      <div className="h-[calc(100vh-120px)]">
        <div className="mb-4">
          <button
            onClick={() => {
              setSelectedSlug(null);
              setPageData(null);
            }}
            className="text-blue-600 hover:underline flex items-center text-sm"
          >
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" /> Back to Page List
          </button>
        </div>
        <Editor initialData={pageData} onSave={() => fetchPageData(selectedSlug)} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Visual Content Editor</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select a page to edit its visual layout and SEO settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PAGES.map((page) => (
          <button
            key={page.slug}
            onClick={() => setSelectedSlug(page.slug)}
            disabled={loading}
            className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group text-left"
          >
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{page.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">slug: /{page.slug}</p>
            </div>
            {loading && selectedSlug === page.slug ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pages;
