import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, ChevronLeft, Eye, Loader2 } from 'lucide-react';
import GrapesEditor from '../components/GrapesEditor';

interface Page {
  id: string;
  slug: string;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
  layout_ko: any;
  layout_en: any;
}

const PageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLang, setActiveLang] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching page:', error);
      navigate('/pages');
    } else {
      setPage(data);
    }
    setLoading(false);
  };

  const handleEditorChange = (data: { html: string; css: string; components: any; style: any }) => {
    if (!page) return;
    
    const combinedHtml = `<style>${data.css}</style>${data.html}`;
    const layoutState = { components: data.components, style: data.style };

    if (activeLang === 'ko') {
      setPage({
        ...page,
        content_ko: combinedHtml,
        layout_ko: layoutState
      });
    } else {
      setPage({
        ...page,
        content_en: combinedHtml,
        layout_en: layoutState
      });
    }
  };

  const savePage = async () => {
    if (!page) return;
    setSaving(true);
    const { error } = await supabase
      .from('pages')
      .update({
        content_ko: page.content_ko,
        content_en: page.content_en,
        layout_ko: page.layout_ko,
        layout_en: page.layout_en,
        updated_at: new Date().toISOString()
      })
      .eq('id', page.id);

    if (error) {
      alert('저장 실패: ' + error.message);
    } else {
      alert('성공적으로 저장되었습니다.');
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-[2000]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">에디터를 불러오는 중...</p>
      </div>
    </div>
  );

  if (!page) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 z-[1500]">
      {/* Editor Header */}
      <header className="h-16 border-b dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shrink-0">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/pages')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="font-bold text-sm text-gray-900 dark:text-white leading-none mb-1">
              {activeLang === 'ko' ? page.title_ko : page.title_en}
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">/p/{page.slug}</p>
          </div>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
          
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveLang('ko')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeLang === 'ko' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setActiveLang('en')}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeLang === 'en' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              ENGLISH
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href={`/p/${page.slug}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4" /> 미리보기
          </a>
          <button
            onClick={savePage}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? '저장 중...' : '변경사항 저장'}
          </button>
        </div>
      </header>

      {/* Full-Screen Editor Canvas */}
      <main className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-black">
        <GrapesEditor 
          key={`${page.id}-${activeLang}`}
          initialData={activeLang === 'ko' ? page.layout_ko : page.layout_en}
          onChange={handleEditorChange}
        />
      </main>
    </div>
  );
};

export default PageEditor;
