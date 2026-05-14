import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  ChevronLeft, 
  Loader2, 
  CheckCircle, 
  MessageSquare,
  User,
  Layout,
  Type,
  Calendar
} from 'lucide-react';
import TiptapEditor from '../components/TiptapEditor';

interface Page {
  id: string;
  title_ko: string;
  slug: string;
}

const PostEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [titleKo, setTitleKo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [authorName, setAuthorName] = useState('NKHB 관리자');
  const [contentKo, setContentKo] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().split('T')[0]);
  const [pageId, setPageId] = useState<string>('');
  const [pages, setPages] = useState<Page[]>([]);
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'ko' | 'en'>('ko');

  useEffect(() => {
    fetchPages();
    if (!isNew) {
      fetchPost();
    }
  }, [id]);

  const fetchPages = async () => {
    const { data } = await supabase.from('pages').select('id, title_ko, slug').order('title_ko');
    if (data) setPages(data);
  };

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('nkhb_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      navigate('/posts');
      return;
    }
    
    setTitleKo(data.title_ko || data.title || '');
    setTitleEn(data.title_en || '');
    setAuthorName(data.author_name);
    setContentKo(data.content_ko || data.content || '');
    setContentEn(data.content_en || '');
    setPageId(data.page_id || '');
    if (data.created_at) {
        setCreatedAt(new Date(data.created_at).toISOString().split('T')[0]);
    }
    setLoading(false);
  };

  const savePost = async () => {
    if (!titleKo.trim() && !titleEn.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }
    
    setSaving(true);
    setSaveStatus('idle');

    const payload = {
      title: titleKo, // Backward compatibility
      title_ko: titleKo,
      title_en: titleEn,
      author_name: authorName,
      content: contentKo, // Backward compatibility
      content_ko: contentKo,
      content_en: contentEn,
      page_id: pageId || null,
      is_approved: true,
      created_at: new Date(createdAt).toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      let error;
      if (isNew) {
        const { error: insertError } = await supabase.from('nkhb_posts').insert([payload]);
        error = insertError;
      } else {
        const { error: updateError } = await supabase.from('nkhb_posts').update(payload).eq('id', id);
        error = updateError;
      }

      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('idle');
        if (isNew) navigate('/posts');
      }, 2000);
    } catch (err: any) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      alert('저장 실패: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-pretendard pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/posts')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              {isNew ? '새 소식 작성' : '소식 수정하기'}
            </h2>
            <p className="text-sm text-gray-500">한국어와 영어로 소식을 작성하여 글로벌 청취자와 소통하세요.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {saveStatus === 'success' && (
            <span className="text-green-600 text-xs font-bold flex items-center gap-1">
              <CheckCircle size={14} /> 저장 완료
            </span>
          )}
          <button
            onClick={savePost}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isNew ? '소식 등록' : '변경사항 저장'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Language Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('ko')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'ko' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              한국어 (KO)
            </button>
            <button
              onClick={() => setActiveTab('en')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'en' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              English (EN)
            </button>
          </div>

          {activeTab === 'ko' ? (
            <>
              {/* Title Input KO */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest px-1">
                    <Type size={12} /> 게시글 제목 (한국어)
                </div>
                <input 
                    type="text"
                    value={titleKo}
                    onChange={(e) => setTitleKo(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xl text-gray-900 dark:text-white"
                    placeholder="한국어 제목을 입력하세요"
                />
              </div>

              {/* Tiptap Editor KO */}
              <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <TiptapEditor 
                  content={contentKo} 
                  onChange={setContentKo} 
                />
              </div>
            </>
          ) : (
            <>
              {/* Title Input EN */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">
                    <Type size={12} /> Post Title (English)
                </div>
                <input 
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-xl text-gray-900 dark:text-white"
                    placeholder="Enter English title here"
                />
              </div>

              {/* Tiptap Editor EN */}
              <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <TiptapEditor 
                  content={contentEn} 
                  onChange={setContentEn} 
                />
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
            {/* Date Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <Calendar size={12} /> 게시 날짜 설정
              </div>
              <input 
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 dark:text-gray-300"
              />
              <p className="text-[10px] text-gray-400 px-1 leading-relaxed">
                * 과거 날짜를 선택하여 소식의 순서를 조정할 수 있습니다.
              </p>
            </div>

            {/* Author Input */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <User size={12} /> 작성자 정보
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl">
                <User className="text-gray-400" size={16} />
                <input 
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-bold text-sm"
                    placeholder="작성자 이름"
                />
              </div>
            </div>

            {/* Page Visibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <Layout size={12} /> 노출 페이지 설정
              </div>
              <select 
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold"
              >
                <option value="">전체 게시판에 노출</option>
                {pages.map(page => (
                  <option key={page.id} value={page.id}>{page.title_ko} (/{page.slug})</option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-bold leading-relaxed flex items-start gap-2">
                  <span className="mt-1 shrink-0">💡</span>
                  에디터를 통해 풍성한 소식을 전하세요. 제목과 날짜는 목록 정렬의 기준이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
