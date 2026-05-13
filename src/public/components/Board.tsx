import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquare, Send, User, Calendar } from 'lucide-react';

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

  useEffect(() => {
    fetchPosts();
  }, [pageId]);

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
      alert(lang === 'ko' ? '등록에 실패했습니다.' : 'Failed to post.');
    } else {
      setName('');
      setContent('');
      fetchPosts();
    }
    setSubmitting(false);
  };

  return (
    <section className="mt-20 border-t dark:border-gray-800 pt-16 pb-24 bg-gray-50/50 dark:bg-gray-900/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {lang === 'ko' ? '방명록 및 소통 게시판' : 'Community Board'}
            </h2>
            <p className="text-gray-500 text-sm">{lang === 'ko' ? '자유롭게 의견을 나누어 주세요.' : 'Feel free to share your thoughts.'}</p>
          </div>
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm mb-12 space-y-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 rounded-2xl border dark:border-gray-700 group focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <User className="w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'ko' ? '작성자 이름' : 'Your name'}
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              required
            />
          </div>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={lang === 'ko' ? '내용을 입력하세요...' : 'Write your message...'}
            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px] text-sm leading-relaxed"
            required
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {lang === 'ko' ? '등록하기' : 'Post Message'}
            </button>
          </div>
        </form>

        {/* Post List */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-10 text-center text-gray-400">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
              <p className="text-gray-400">{lang === 'ko' ? '첫 번째 게시글을 남겨보세요!' : 'Be the first to post!'}</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 font-bold uppercase">
                      {post.author_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{post.author_name}</h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

export default Board;
