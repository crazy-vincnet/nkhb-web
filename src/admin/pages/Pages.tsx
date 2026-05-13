import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  FileText, 
  Eye, 
  EyeOff,
  Search,
  ExternalLink,
  Monitor,
  Code
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
  is_published: boolean;
}

const Pages = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [activeLang, setActiveLang] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pages:', error);
    } else {
      setPages(data || []);
      if (data && data.length > 0 && !activePage) {
        setActivePage(data[0]);
      }
    }
    setLoading(false);
  };

  const createPage = async () => {
    const newSlug = `new-page-${Date.now()}`;
    const newPage = {
      slug: newSlug,
      title_ko: '제목 없는 페이지',
      title_en: 'Untitled Page',
      content_ko: '',
      content_en: '',
      layout_ko: null,
      layout_en: null,
      is_published: false
    };

    const { data, error } = await supabase
      .from('pages')
      .insert([newPage])
      .select()
      .single();

    if (error) {
      alert('페이지 생성 실패: ' + error.message);
    } else if (data) {
      setPages([data, ...pages]);
      setActivePage(data);
    }
  };

  const deletePage = async (id: string) => {
    if (!window.confirm('정말로 이 페이지를 삭제하시겠습니까?')) return;

    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id);

    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      setPages(pages.filter(p => p.id !== id));
      if (activePage?.id === id) {
        setActivePage(pages.find(p => p.id !== id) || null);
      }
    }
  };

  const savePage = async () => {
    if (!activePage) return;
    setSaving(true);
    const { error } = await supabase
      .from('pages')
      .update({
        slug: activePage.slug,
        title_ko: activePage.title_ko,
        title_en: activePage.title_en,
        content_ko: activePage.content_ko,
        content_en: activePage.content_en,
        layout_ko: activePage.layout_ko,
        layout_en: activePage.layout_en,
        is_published: activePage.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', activePage.id);

    if (error) {
      alert('저장 실패: ' + error.message);
    } else {
      setPages(pages.map(p => p.id === activePage.id ? activePage : p));
      alert('성공적으로 저장되었습니다.');
    }
    setSaving(false);
  };

  const handleEditorChange = (data: { html: string; css: string; components: any; style: any }) => {
    if (!activePage) return;
    
    const combinedHtml = `<style>${data.css}</style>${data.html}`;
    const layoutState = { components: data.components, style: data.style };

    if (activeLang === 'ko') {
      setActivePage({
        ...activePage,
        content_ko: combinedHtml,
        layout_ko: layoutState
      });
    } else {
      setActivePage({
        ...activePage,
        content_en: combinedHtml,
        layout_en: layoutState
      });
    }
  };

  const filteredPages = pages.filter(p => 
    p.title_ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && pages.length === 0) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Sidebar - Page List */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="p-4 border-b dark:border-gray-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              서브페이지
            </h2>
            <button 
              onClick={createPage}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="페이지 추가"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="페이지 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredPages.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page)}
              className={`w-full text-left p-3 rounded-xl transition-all group ${
                activePage?.id === page.id 
                  ? 'bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 ring-1 ring-blue-500/10' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold text-sm truncate ${activePage?.id === page.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {page.title_ko}
                </span>
                {!page.is_published && (
                  <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500">Draft</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                <LinkIcon className="w-3 h-3" />
                /{page.slug}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      {activePage ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveLang('ko')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    activeLang === 'ko' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  한국어
                </button>
                <button
                  onClick={() => setActiveLang('en')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    activeLang === 'en' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  ENGLISH
                </button>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setEditorMode('visual')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    editorMode === 'visual' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" /> Visual
                </button>
                <button
                  onClick={() => setEditorMode('code')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    editorMode === 'code' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" /> HTML
                </button>
              </div>

              <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePage({...activePage, is_published: !activePage.is_published})}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    activePage.is_published 
                      ? 'bg-green-50 text-green-600 border border-green-200' 
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {activePage.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  {activePage.is_published ? 'Published' : 'Private'}
                </button>
                <a 
                  href={`/p/${activePage.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  미리보기
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => deletePage(activePage.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={savePage}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? '저장 중...' : '페이지 저장'}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30 dark:bg-gray-900/10">
            {/* Header Settings */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page Title ({activeLang.toUpperCase()})</label>
                <input 
                  type="text"
                  value={activeLang === 'ko' ? activePage.title_ko : activePage.title_en}
                  onChange={(e) => setActivePage(activeLang === 'ko' 
                    ? {...activePage, title_ko: e.target.value} 
                    : {...activePage, title_en: e.target.value}
                  )}
                  className="w-full bg-transparent border-none outline-none text-lg font-bold text-gray-900 dark:text-white p-0"
                  placeholder="제목을 입력하세요"
                />
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">URL Slug</label>
                <div className="flex items-center justify-center gap-2 font-mono text-sm">
                  <span className="text-gray-400">/p/</span>
                  <input 
                    type="text"
                    value={activePage.slug}
                    onChange={(e) => setActivePage({...activePage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    className="bg-transparent border-none outline-none text-blue-600 font-bold"
                    placeholder="page-slug"
                  />
                </div>
              </div>
            </div>

            {/* Main Content Editor */}
            <div className="max-w-6xl mx-auto h-[700px]">
              {editorMode === 'visual' ? (
                <GrapesEditor 
                  key={`${activePage.id}-${activeLang}`} // Force re-init on page/lang switch
                  initialData={activeLang === 'ko' ? activePage.layout_ko : activePage.layout_en}
                  onChange={handleEditorChange}
                  minHeight="100%"
                />
              ) : (
                <textarea 
                  value={activeLang === 'ko' ? activePage.content_ko : activePage.content_en}
                  onChange={(e) => setActivePage(activeLang === 'ko' 
                    ? {...activePage, content_ko: e.target.value} 
                    : {...activePage, content_en: e.target.value}
                  )}
                  className="w-full h-full p-6 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed shadow-sm"
                  placeholder="HTML 코드를 직접 입력하세요..."
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
          <FileText className="w-12 h-12 text-gray-200" />
          <h3 className="text-lg font-bold text-gray-700">관리할 페이지를 선택하세요</h3>
          <button onClick={createPage} className="btn-hero bg-blue-600 text-white px-6 py-2 rounded-xl">새 페이지 추가</button>
        </div>
      )}
    </div>
  );
};

export default Pages;
