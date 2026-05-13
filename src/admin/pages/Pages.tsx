import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Link as LinkIcon, 
  FileText, 
  Eye, 
  EyeOff,
  Search,
  ExternalLink,
  Edit3,
  Save
} from 'lucide-react';

interface Page {
  id: string;
  slug: string;
  title_ko: string;
  title_en: string;
  content_ko: string;
  content_en: string;
  is_published: boolean;
}

const Pages = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      const nextPages = pages.filter(p => p.id !== id);
      setPages(nextPages);
      setActivePage(nextPages[0] || null);
    }
  };

  const togglePublish = async (page: Page) => {
    const nextStatus = !page.is_published;
    const { error } = await supabase
      .from('pages')
      .update({ is_published: nextStatus })
      .eq('id', page.id);

    if (error) {
      alert('상태 변경 실패: ' + error.message);
    } else {
      const updatedPage = { ...page, is_published: nextStatus };
      setPages(pages.map(p => p.id === page.id ? updatedPage : p));
      setActivePage(updatedPage);
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
                  <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 font-bold uppercase tracking-tighter">Draft</span>
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

      {/* Detail Area */}
      {activePage ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50/30 dark:bg-gray-900/10">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-8">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-4 mt-6">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">페이지 제목 (KO)</label>
                  <input 
                    type="text"
                    value={activePage.title_ko}
                    onChange={(e) => setActivePage({...activePage, title_ko: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Page Title (EN)</label>
                  <input 
                    type="text"
                    value={activePage.title_en}
                    onChange={(e) => setActivePage({...activePage, title_en: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-1">URL 주소 (Slug)</label>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-2xl border dark:border-gray-700 font-mono text-sm group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                    <span className="text-gray-400">/p/</span>
                    <input 
                      type="text"
                      value={activePage.slug}
                      onChange={(e) => setActivePage({...activePage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                      className="bg-transparent border-none outline-none text-blue-600 font-bold w-full p-0"
                      placeholder="page-slug"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from('pages')
                    .update({ 
                      slug: activePage.slug,
                      title_ko: activePage.title_ko,
                      title_en: activePage.title_en 
                    })
                    .eq('id', activePage.id);
                  
                  if (error) {
                    alert('저장 실패: ' + error.message);
                  } else {
                    setPages(pages.map(p => p.id === activePage.id ? activePage : p));
                    alert('페이지 정보가 저장되었습니다.');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all mb-2"
              >
                <Save className="w-4 h-4" />
                페이지 기본 정보 저장
              </button>

              <button
                onClick={() => navigate(`/editor/${activePage.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <Edit3 className="w-5 h-5" />
                비주얼 에디터로 편집하기
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => togglePublish(activePage)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border transition-colors ${
                    activePage.is_published 
                      ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {activePage.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {activePage.is_published ? '공개 중' : '비공개'}
                </button>
                <a 
                  href={`/p/${activePage.slug}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  미리보기
                </a>
              </div>
            </div>

            <div className="pt-6 border-t dark:border-gray-700">
              <button
                onClick={() => deletePage(activePage.id)}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-bold py-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                페이지 영구 삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
          <FileText className="w-12 h-12 text-gray-200" />
          <h3 className="text-lg font-bold text-gray-700">관리할 페이지를 선택하세요</h3>
        </div>
      )}
    </div>
  );
};

export default Pages;
