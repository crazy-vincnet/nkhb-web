import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Post {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface BoardProps {
  pageId: string;
  lang: 'ko' | 'en';
  titleKo?: string;
  titleEn?: string;
}

const Board: React.FC<BoardProps> = ({ pageId, lang, titleKo, titleEn }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [pageId]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('nkhb_posts')
      .select('id, author_name, content, created_at')
      .eq('page_id', pageId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const boardTitle = lang === 'ko' ? (titleKo || '공지 및 소식') : (titleEn || 'Board & Updates');

  return (
    <section className="mt-32 border-t dark:border-gray-800 pt-24 pb-40 bg-white dark:bg-[#0a192f] font-pretendard">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-100 dark:border-blue-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Updates
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
            {boardTitle}
          </h2>
          <div className="w-12 h-1.5 bg-blue-600 rounded-full mb-6"></div>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed text-sm md:text-base">
            {lang === 'ko' 
              ? '뉴코리아 희망방송의 새로운 소식과 중요한 공지사항을 확인하세요.' 
              : 'Stay informed with the latest official news and announcements from NKHB.'}
          </p>
        </div>

        {/* Post List */}
        <div className="relative space-y-12">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-32 text-center bg-gray-50/50 dark:bg-gray-900/20 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">
                {lang === 'ko' ? '등록된 소식이 아직 없습니다.' : 'No updates have been posted yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {posts.map((post) => (
                <div 
                  key={post.id} 
                  className="group relative bg-white dark:bg-gray-900/40 p-8 md:p-12 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.08)]"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-8">
                    {/* Date Column */}
                    <div className="md:w-32 shrink-0">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-blue-600 leading-none mb-1">
                                {new Date(post.created_at).getDate().toString().padStart(2, '0')}
                            </span>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 space-y-6 overflow-hidden text-left">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-blue-600 dark:text-blue-400 text-sm uppercase tracking-wider">{post.author_name}</h4>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase">Announcement</span>
                      </div>
                      
                      <div 
                        className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed font-medium prose-img:rounded-3xl prose-a:text-blue-600"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                      />

                      <div className="pt-4 flex items-center gap-2 text-blue-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-500">
                         NKHB Official Message <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-10 right-10 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
                    <MessageSquare className="w-24 h-24" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Support Info */}
        <div className="mt-24 p-10 bg-gray-900 rounded-[3rem] text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent"></div>
            <div className="relative z-10 space-y-4">
                <p className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Support NKHB</p>
                <h3 className="text-2xl font-bold">북한 주민들에게 전해지는 진실의 목소리</h3>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">여러분의 후원이 끊기지 않는 방송을 만듭니다. 지금 사역에 동참해 주세요.</p>
                <div className="pt-4">
                    <a href="/#support" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all text-sm">
                        후원 안내 보기 <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Board;
