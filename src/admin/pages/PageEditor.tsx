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
  Trash2,
  Calendar,
  Type,
  Plus,
  MessageSquare
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
  has_board: boolean;
  board_title_ko: string;
  board_title_en: string;
}

interface SEOData {
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  og_image_url: string;
}

interface Post {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  is_approved: boolean;
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
  const [settingsTab, setSettingsTab] = useState<'seo' | 'board'>('seo');
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const editorRef = useRef<any>(null);

  useEffect(() => {
    fetchPageAndSEO();
  }, [id]);

  useEffect(() => {
    if (showSettings && settingsTab === 'board' && page) {
      fetchPosts();
    }
  }, [showSettings, settingsTab, page]);

  const fetchPageAndSEO = async () => {
    if (!id) return;
    setLoading(true);
    
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
      setSeo({
        title_ko: pageData.title_ko,
        title_en: pageData.title_en,
        description_ko: '',
        description_en: '',
        og_image_url: ''
      });
    }
    
    setLoading(false);
  };

  const fetchPosts = async () => {
    if (!page) return;
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('page_id', page.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoadingPosts(false);
  };

  const deletePost = async (postId: string) => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) setPosts(posts.filter(p => p.id !== postId));
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
      
      // Use getProjectData for full state persistence (includes assets, styles, components)
      const projectData = editor.getProjectData();

      const pageUpdate: any = {
        has_board: page.has_board,
        board_title_ko: page.board_title_ko,
        board_title_en: page.board_title_en,
        updated_at: new Date().toISOString()
      };

      if (activeLang === 'ko') {
        pageUpdate.content_ko = combinedHtml;
        pageUpdate.layout_ko = projectData;
      } else {
        pageUpdate.content_en = combinedHtml;
        pageUpdate.layout_en = projectData;
      }

      const { error: pError } = await supabase
        .from('pages')
        .update(pageUpdate)
        .eq('id', page.id);

      if (pError) throw pError;

      const { error: sError } = await supabase
        .from('seo_settings')
        .upsert({
          page_slug: page.slug,
          ...seo,
          updated_at: new Date().toISOString()
        }, { onConflict: 'page_slug' });

      if (sError) throw sError;

      setPage({
        ...page,
        ...(activeLang === 'ko' 
          ? { content_ko: combinedHtml, layout_ko: projectData } 
          : { content_en: combinedHtml, layout_en: projectData })
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
      <div className="flex flex-col items-center gap-4 text-center font-pretendard">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <div>
          <p className="text-gray-900 dark:text-white font-bold text-lg">NKHB Visual Studio</p>
          <p className="text-gray-500 text-sm">콘텐츠와 설정을 동기화하는 중입니다...</p>
        </div>
      </div>
    </div>
  );

  if (!page) return null;

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-gray-900 z-[1500] font-pretendard">
      {/* Header */}
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

          {activeLang === 'en' && (
            <button
              onClick={() => {
                if (window.confirm('한국어 레이아웃을 영어 레이아웃으로 덮어쓰시겠습니까? 현재 영어 데이터는 삭제됩니다.')) {
                  setPage(prev => prev ? ({ ...prev, layout_en: prev.layout_ko }) : null);
                  // Refresh editor if it's already mounted
                  if (editorRef.current) {
                    editorRef.current.loadProjectData(page?.layout_ko);
                  }
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-[10px] font-black transition-all border border-indigo-100"
              title="한국어 디자인 그대로 가져오기"
            >
              <Plus className="w-3 h-3 rotate-45" /> Sync Design from KO
            </button>
          )}
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
        <main className="flex-1 relative bg-white overflow-hidden">
          <GrapesEditor 
            key={`${id}-${activeLang}`}
            initialData={activeLang === 'ko' ? page.layout_ko : page.layout_en}
            onReady={(editor) => {
              editorRef.current = editor;
            }}
          />
        </main>

        {showSettings && (
          <aside className="w-[450px] border-l dark:border-gray-800 bg-white dark:bg-gray-800 overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl z-40">
            <div className="p-2 border-b dark:border-gray-700 flex bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
              <button 
                onClick={() => setSettingsTab('seo')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settingsTab === 'seo' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}
              >
                SEO 설정
              </button>
              <button 
                onClick={() => setSettingsTab('board')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${settingsTab === 'board' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400'}`}
              >
                게시판 관리
              </button>
              <button onClick={() => setShowSettings(false)} className="p-2 ml-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              {settingsTab === 'seo' ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded w-fit">
                      <Globe className="w-3 h-3" /> {activeLang === 'ko' ? '한국어 설정' : 'English Settings'}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">페이지 제목 (Title)</label>
                      <input 
                        type="text"
                        value={activeLang === 'ko' ? seo.title_ko : seo.title_en}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeo(prev => activeLang === 'ko' ? { ...prev, title_ko: val } : { ...prev, title_en: val });
                        }}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500">메타 설명 (Description)</label>
                      <textarea 
                        value={activeLang === 'ko' ? seo.description_ko : seo.description_en}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSeo(prev => activeLang === 'ko' ? { ...prev, description_ko: val } : { ...prev, description_en: val });
                        }}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 min-h-[120px] resize-none"
                      />
                    </div>
                  </div>

                  {/* SEO Simulation */}
                  <div className="pt-6 border-t dark:border-gray-700 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded w-fit">
                      <Globe className="w-3 h-3" /> Search Preview (Simulation)
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-1.5">
                      <div className="text-[12px] text-gray-500 truncate">nkhb.org › p › {page.slug}</div>
                      <div className="text-[18px] text-blue-700 font-medium truncate hover:underline cursor-pointer">
                        {activeLang === 'ko' ? (seo.title_ko || page.title_ko) : (seo.title_en || page.title_en)} | 뉴코리아 희망방송
                      </div>
                      <div className="text-[13px] text-gray-600 line-clamp-2 leading-relaxed">
                        {(activeLang === 'ko' ? seo.description_ko : seo.description_en) || '페이지 설명을 입력하면 여기에 검색 결과가 미리 표시됩니다...'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t dark:border-gray-700 space-y-4">
                    <label className="text-xs font-bold text-gray-500">소셜 공유 이미지 (OG Image)</label>
                    <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-900">
                      {seo.og_image_url ? (
                        <img src={seo.og_image_url} className="w-full h-full object-cover" alt="SEO Preview" />
                      ) : (
                        <p className="text-[10px] text-gray-400">이미지 없음</p>
                      )}
                    </div>
                    <input 
                      type="text"
                      value={seo.og_image_url}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSeo(prev => ({ ...prev, og_image_url: val }));
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-[11px] font-mono outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Board Config */}
                  <div className="flex items-center justify-between p-5 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100 dark:shadow-none relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="font-bold text-sm">게시판 활성화</h4>
                      <p className="text-[10px] opacity-80 mt-0.5">페이지 하단 소식창 노출</p>
                    </div>
                    <button 
                      onClick={() => setPage(prev => prev ? ({...prev, has_board: !prev.has_board}) : null)}
                      className={`w-12 h-6 rounded-full transition-colors relative z-10 border-2 ${page?.has_board ? 'bg-white border-white' : 'bg-transparent border-white/30'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${page?.has_board ? 'left-6 bg-blue-600' : 'left-0.5 bg-white/50'}`}></div>
                    </button>
                    <MessageSquare className="absolute -right-4 -bottom-4 w-20 h-20 text-white/10" />
                  </div>

                  {page?.has_board && (
                    <div className="space-y-8">
                      {/* Board Title Settings */}
                      <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">
                          <Type className="w-3 h-3" /> 게시판 타이틀 설정
                        </div>
                        <div className="space-y-3">
                            <input 
                                type="text"
                                value={page.board_title_ko}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPage(prev => prev ? ({...prev, board_title_ko: val}) : null);
                                }}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                                placeholder="한국어 제목"
                            />
                            <input 
                                type="text"
                                value={page.board_title_en}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPage(prev => prev ? ({...prev, board_title_en: val}) : null);
                                }}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
                                placeholder="English Title"
                            />
                        </div>
                      </div>

                      {/* Post List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                          <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest text-gray-900 dark:text-white">등록된 소식 ({posts.length})</h4>
                          <div className="flex gap-3">
                              <button onClick={() => navigate('/posts')} className="text-[10px] font-bold text-blue-600 hover:underline">모든 글 관리</button>
                              <button onClick={fetchPosts} className="text-[10px] font-bold text-blue-600 hover:underline">새로고침</button>
                          </div>
                        </div>

                        {loadingPosts ? (
                          <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-300" /></div>
                        ) : (
                          <div className="space-y-3">
                            {posts.map(post => (
                              <div key={post.id} className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 group relative shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-gray-900 dark:text-white">{post.author_name}</span>
                                      <span className="text-[8px] bg-blue-50 text-blue-600 px-1 rounded font-black tracking-tighter">ADMIN</span>
                                  </div>
                                  <button 
                                    onClick={() => deletePost(post.id)}
                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-2 prose-sm prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
                                <div className="flex items-center gap-1 text-[9px] text-gray-400">
                                  <Calendar className="w-2.5 h-2.5" />
                                  {new Date(post.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default PageEditor;
