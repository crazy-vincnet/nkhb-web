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
  Layout
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

  const [authorName, setAuthorName] = useState('NKHB 관리자');
  const [content, setContent] = useState('');
  const [pageId, setPageId] = useState<string>('');
  const [pages, setPages] = useState<Page[]>([]);
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
    
    setAuthorName(data.author_name);
    setContent(data.content);
    setPageId(data.page_id || '');
    setLoading(false);
  };

  const savePost = async () => {
    if (!content.trim()) {
      alert('내용을 입력해 주세요.');
      return;
    }
    
    setSaving(true);
    setSaveStatus('idle');

    const payload = {
      author_name: authorName,
      content: content,
      page_id: pageId || null,
      is_approved: true,
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
    <div className="max-w-5xl mx-auto space-y-8 font-pretendard pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/posts')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              {isNew ? '새 소식 작성' : '소식 수정하기'}
            </h2>
            <p className="text-sm text-gray-500">에디터를 사용하여 풍성한 콘텐츠를 작성하세요.</p>
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
          <div className="bg-white dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <TiptapEditor 
              content={content} 
              onChange={setContent} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <User size={12} /> 작성자 정보
              </div>
              <input 
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                placeholder="작성자 이름"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <Layout size={12} /> 노출 페이지 설정
              </div>
              <select 
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              >
                <option value="">전체 게시판에 노출</option>
                {pages.map(page => (
                  <option key={page.id} value={page.id}>{page.title_ko} (/{page.slug})</option>
                ))}
              </select>
              <p className="text-[10px] text-gray-400 px-1 leading-relaxed italic">
                * 특정 페이지를 선택하면 해당 서브페이지 하단 게시판에만 이 글이 나타납니다.
              </p>
            </div>

            <div className="pt-6 border-t dark:border-gray-700">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                  Tiptap 에디터를 통해 이미지, 유튜브 영상, 표 등을 자유롭게 삽입할 수 있습니다.
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
