import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Save, ChevronLeft, Eye, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeLang, setActiveLang] = useState<'ko' | 'en'>('ko');
  
  // Use a ref to store the GrapesJS editor instance without triggering re-renders
  const editorRef = useRef<any>(null);

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

  const savePage = async () => {
    if (!page || !editorRef.current) return;
    
    setSaving(true);
    setSaveStatus('idle');

    try {
      const editor = editorRef.current;
      const html = editor.getHtml() || '';
      const css = editor.getCss() || '';
      const combinedHtml = `<style>${css}</style>${html}`;
      const layoutState = { 
        components: editor.getComponents(), 
        style: editor.getStyle() 
      };

      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (activeLang === 'ko') {
        updateData.content_ko = combinedHtml;
        updateData.layout_ko = layoutState;
      } else {
        updateData.content_en = combinedHtml;
        updateData.layout_en = layoutState;
      }

      const { error } = await supabase
        .from('pages')
        .update(updateData)
        .eq('id', page.id);

      if (error) throw error;

      // Update local state to keep everything in sync
      setPage({
        ...page,
        ...(activeLang === 'ko' 
          ? { content_ko: combinedHtml, layout_ko: layoutState } 
          : { content_en: combinedHtml, layout_en: layoutState })
      });
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error: any) {
      console.error('Save failed:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-[2000]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium font-pretendard">에디터를 준비하는 중입니다...</p>
      </div>
    </div>
  );

  if (!page) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 z-[1500] font-pretendard">
      {/* Editor Header */}
      <header className="h-16 border-b dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/pages')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
            title="목록으로 돌아가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="min-w-0">
            <h1 className="font-bold text-sm text-gray-900 dark:text-white leading-none mb-1 truncate max-w-[200px]">
              {activeLang === 'ko' ? page.title_ko : page.title_en}
            </h1>
            <p className="text-[10px] text-gray-400 font-mono">/p/{page.slug}</p>
          </div>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
          
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              onClick={() => setActiveLang('ko')}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLang === 'ko' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              한국어 편집
            </button>
            <button
              onClick={() => setActiveLang('en')}
              className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLang === 'en' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ENGLISH Edit
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {saveStatus === 'success' && (
            <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold animate-in fade-in duration-300">
              <CheckCircle className="w-4 h-4" /> 저장 완료
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-1.5 text-red-600 text-xs font-bold animate-in zoom-in duration-300">
              <AlertCircle className="w-4 h-4" /> 저장 실패
            </div>
          )}

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

          <a 
            href={`/p/${page.slug}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <Eye className="w-4 h-4" /> 미리보기
          </a>
          <button
            onClick={savePage}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50 text-white ${
              saveStatus === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            }`}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? '저장 중...' : '페이지 저장'}
          </button>
        </div>
      </header>

      {/* Full-Screen Editor Canvas */}
      <main className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-black">
        <GrapesEditor 
          key={`${id}-${activeLang}`} // Only re-init when switching page or language
          initialData={activeLang === 'ko' ? page.layout_ko : page.layout_en}
          onReady={(editor) => {
            editorRef.current = editor;
          }}
        />
      </main>
    </div>
  );
};

export default PageEditor;
