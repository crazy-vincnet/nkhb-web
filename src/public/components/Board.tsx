import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquare, Send, User, Calendar, ShieldCheck, Info } from 'lucide-react';

interface Post {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface BoardProps {
  pageId: string;
  lang: 'ko' | 'en';
}

const Board: React.FC<BoardProps> = ({ pageId, lang }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
    fetchPosts();
  }, [pageId]);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAdmin(!!session);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('id, author_name, content, created_at')
      .eq('page_id', pageId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('posts')
      .insert([
        {
          page_id: pageId,
          author_name: name,
          content: content,
          is_approved: true
        }
      ]);

    if (error) {
      alert(lang === 'ko' ? '등록에 실패했습니다 (권한 부족).' : 'Failed to post (Unauthorized).');
    } else {
      setName('');
      setContent('');
      fetchPosts();
    }
    setSubmitting(false);
  };

  return (
    <section className="mt-32 border-t dark:border-gray-800 pt-20 pb-32 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/10 dark:to-transparent">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 dark:shadow-none flex items-center justify-center transform -rotate-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {lang === 'ko' ? '공지 및 소식' : 'Board & Updates'}
              </h2>
              <p className="text-gray-500 text-sm mt-1 font-medium">
                {lang === 'ko' ? 'NKHB의 소중한 소식들을 전해드립니다.' : 'Official updates and news from NKHB.'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-100 dark:border-blue-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            {lang === 'ko' ? '관리자 전용 게시판' : 'Admin Only Board'}
          </div>
        </div>

        {/* Post Form - Only for Admins */}
        {isAdmin && (
          <div className="mb-16 transform transition-all hover:scale-[1.01]">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-blue-100 dark:border-gray-700 shadow-2xl shadow-blue-100 dark:shadow-none space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Administrator Console</span>
                </div>
              <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <User className="w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'ko' ? '작성자 (예: NKHB 관리자)' : 'Author Name'}
                  className="bg-transparent border-none outline-none text-sm w-full font-bold text-gray-900 dark:text-white"
                  required
                />
              </div>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={lang === 'ko' ? '북한 주민들과 동역자들에게 전할 소식을 입력하세요...' : 'Write an announcement...'}
                className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[150px] text-sm leading-relaxed"
                required
              />
              <div className="flex justify-end pt-2">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-50 group"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  {lang === 'ko' ? '소식 등록하기' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Informative Note for Public Users */}
        {!isAdmin && posts.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl mb-10 text-gray-500 text-xs border border-gray-200/50 dark:border-gray-700/50">
            <Info className="w-4 h-4" />
            {lang === 'ko' ? '본 게시판은 NKHB 관리자에 의해 공식 소식이 업데이트되는 공간입니다.' : 'This board is curated by NKHB administrators for official updates.'}
          </div>
        )}

        {/* Post List */}
        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div className="py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-200" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-24 text-center bg-white dark:bg-gray-800 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">{lang === 'ko' ? '아직 등록된 소식이 없습니다.' : 'No announcements yet.'}</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <div 
                key={post.id} 
                className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
              >
                {index === 0 && (
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-bl-2xl uppercase tracking-widest">Latest</div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-100 dark:shadow-none">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-gray-900 dark:text-white text-lg">{post.author_name}</h4>
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter border border-blue-100 dark:border-blue-800">Admin</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {post.content}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-end">
                    <img src="https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png" className="h-5 opacity-20 grayscale filter" alt="logo" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default Board;
