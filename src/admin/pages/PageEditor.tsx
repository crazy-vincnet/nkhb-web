import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  ChevronLeft, 
  Loader2, 
  CheckCircle, 
  Settings, 
  Globe,
  X,
  Search
} from 'lucide-react';
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

interface SEOData {
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  og_image_url: string;
}

const PageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<Page | null>(null);
  const [seo, setSeo] = useState<SEOData>({
    title_ko: '',
    title_en: '',
    description_ko: '',
    description_en: '',
    og_image_url: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeLang, setActiveLang] = useState<'ko' | 'en'>('ko');
  const [showSettings, setShowSettings] = useState(false);
  
  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchPageAndSEO();
  }, [id]);

  const fetchPageAndSEO = async () => {
    if (!id) return;
    setLoading(true);
    
    // 1. Fetch Page
    const { data: pageData, error: pageError } = await supabase
      .from('pages')
      .select('*')
      .eq('id', id)
      .single();

    if (pageError) {
      navigate('/pages');
      return;
    }
    
    setPage(pageData);

    // 2. Fetch SEO (if exists)
    const { data: seoData } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page_slug', pageData.slug)
      .single();

    if (seoData) {
      setSeo({
        title_ko: seoData.title_ko || '',
        title_en: seoData.title_en || '',
        description_ko: seoData.description_ko || '',
        description_en: seoData.description_en || '',
        og_image_url: seoData.og_image_url || ''
      });
    } else {
      // Default SEO based on page info
      setSeo(prev => ({
        ...prev,
        title_ko: pageData.title_ko,
        title_en: pageData.title_en
      }));
    }
    
    setLoading(false);
  };

  const saveAll = async () => {
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

      // 1. Save Page Content
      const pageUpdate: any = {
        updated_at: new Date().toISOString()
      };

      if (activeLang === 'ko') {
        pageUpdate.content_ko = combinedHtml;
        pageUpdate.layout_ko = layoutState;
      } else {
        pageUpdate.content_en = combinedHtml;
        pageUpdate.layout_en = layoutState;
      }

      const { error: pError } = await supabase
        .from('pages')
        .update(pageUpdate)
        .eq('id', page.id);

      if (pError) throw pError;

      // 2. Save SEO Settings
      const { error: sError } = await supabase
        .from('seo_settings')
        .upsert({
          page_slug: page.slug,
          ...seo,
          updated_at: new Date().toISOString()
        }, { onConflict: 'page_slug' });

      if (sError) throw sError;

      // Sync local state
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
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div>
          <p className="text-gray-900 dark:text-white font-bold text-lg">NKHB Visual Studio</p>
          <p className="text-gray-500 text-sm">콘텐츠와 SEO 설정을 동기화하는 중입니다...</p>
        </div>
      </div>
    </div>
  );

  if (!page) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 z-[1500] font-pretendard">
      {/* Enhanced Header */}
      <header className="h-16 border-b dark:border-gray-800 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shrink-0 shadow-sm z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/pages')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
            <button
              onClick={() => setActiveLang('ko')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLang === 'ko' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              한국어
            </button>
            <button
              onClick={() => setActiveLang('en')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeLang === 'en' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 mr-4">
            {saveStatus === 'success' && (
              <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> 저장됨
              </span>
            )}
            {saving && <span className="text-blue-500 text-xs animate-pulse">동기화 중...</span>}
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-xl transition-colors ${showSettings ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
            title="SEO 및 페이지 설정"
          >
            <Settings className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            페이지 저장
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Editor */}
        <main className="flex-1 relative overflow-hidden bg-white">
          <GrapesEditor 
            key={`${id}-${activeLang}`}
            initialData={activeLang === 'ko' ? page.layout_ko : page.layout_en}
            onReady={(editor) => {
              editorRef.current = editor;
            }}
          />
        </main>

        {/* Integrated SEO Sidebar */}
        {showSettings && (
          <aside className="w-80 border-l dark:border-gray-800 bg-white dark:bg-gray-800 overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl z-40">
            <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600" />
                SEO 및 검색 최적화
              </h3>
              <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded w-fit">
                  <Globe className="w-3 h-3" /> {activeLang === 'ko' ? '한국어 설정' : 'English Settings'}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500">페이지 제목 (Title)</label>
                  <input 
                    type="text"
                    value={activeLang === 'ko' ? seo.title_ko : seo.title_en}
                    onChange={(e) => setSeo(prev => activeLang === 'ko' 
                      ? { ...prev, title_ko: e.target.value } 
                      : { ...prev, title_en: e.target.value }
                    )}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="검색 결과 제목"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500">메타 설명 (Description)</label>
                  <textarea 
                    value={activeLang === 'ko' ? seo.description_ko : seo.description_en}
                    onChange={(e) => setSeo(prev => activeLang === 'ko' 
                      ? { ...prev, description_ko: e.target.value } 
                      : { ...prev, description_en: e.target.value }
                    )}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px] resize-none"
                    placeholder="검색 결과 요약 문구"
                  />
                </div>
              </div>

              <div className="pt-6 border-t dark:border-gray-700 space-y-4">
                <label className="text-xs font-bold text-gray-500">소셜 공유 이미지 (OG Image)</label>
                <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  {seo.og_image_url ? (
                    <img src={seo.og_image_url} className="w-full h-full object-cover" alt="SEO Preview" />
                  ) : (
                    <p className="text-[10px] text-gray-400">이미지 없음</p>
                  )}
                </div>
                <input 
                  type="text"
                  value={seo.og_image_url}
                  onChange={(e) => setSeo(prev => ({ ...prev, og_image_url: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-[11px] font-mono outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="https://image-url.com"
                />
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  * 팁: 이미지 편집기에서 업로드한 뒤 URL을 복사하여 여기에 붙여넣으세요.
                </p>
              </div>

              <div className="pt-6 border-t dark:border-gray-700">
                <p className="text-[11px] text-gray-400 mb-4">
                  상단의 '페이지 저장' 버튼을 누르면 SEO 설정도 함께 저장됩니다.
                </p>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300"
                >
                  설정 닫기
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default PageEditor;
