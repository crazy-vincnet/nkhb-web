import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Search, 
  MessageSquare, 
  Calendar, 
  ChevronRight,
  Edit3,
  User,
  Type
} from 'lucide-react';

interface Post {
  id: string;
  title: string | null;
  title_ko: string | null;
  title_en: string | null;
  author_name: string;
  content: string;
  content_ko: string | null;
  content_en: string | null;
  post_type: 'news' | 'audio';
  category: string | null;
  created_at: string;
  page_id: string | null;
  is_approved: boolean;
}

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nkhb_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    const { error } = await supabase.from('nkhb_posts').delete().eq('id', id);
    if (!error) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const filteredPosts = posts.filter(p => 
    (p.title_ko?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.title_en?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.author_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.content_ko?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.content_en?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.content?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-pretendard">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            게시글 및 소식 관리
          </h2>
          <p className="text-sm text-gray-500 mt-1">서브페이지 게시판에 노출되는 모든 소식을 관리합니다.</p>
        </div>
        <button
          onClick={() => navigate('/posts/new')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none"
        >
          <Plus className="w-5 h-5" /> 새 소식 작성
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text"
          placeholder="제목, 내용 또는 작성자 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-32 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">검색 결과가 없거나 등록된 소식이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  {post.post_type === 'audio' ? <MessageSquare className="w-6 h-6 text-indigo-600" /> : <Type className="w-6 h-6" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.post_type === 'audio' && (
                        <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-black shrink-0">AUDIO</span>
                    )}
                    <span className="font-bold text-gray-900 dark:text-white truncate">
                        {post.title_ko || post.title || post.title_en || '제목 없음'}
                    </span>
                    {post.category && (
                        <span className="text-[10px] text-indigo-500 font-bold px-2 py-0.5 bg-indigo-50 rounded-full shrink-0">
                            #{post.category}
                        </span>
                    )}
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono shrink-0">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><User size={10} /> {post.author_name}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <div 
                        className="line-clamp-1 opacity-70"
                        dangerouslySetInnerHTML={{ __html: (post.content_ko || post.content || post.content_en || '').replace(/<[^>]*>/g, '').substring(0, 100) }}
                      />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => navigate(`/posts/edit/${post.id}`)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="수정"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
