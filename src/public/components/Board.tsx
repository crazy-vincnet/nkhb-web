import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, X, Calendar, User } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Post {
  id: string;
  title: string | null;
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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [pageId]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('nkhb_posts')
      .select('id, title, author_name, content, created_at')
      .eq('is_approved', true);

    if (pageId) {
      // If pageId is provided, show posts for that page PLUS global posts (page_id IS NULL)
      query = query.or(`page_id.eq.${pageId},page_id.is.null`);
    } else {
      // If no pageId provided, just show global posts
      query = query.is('page_id', null);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const boardTitle = lang === 'ko' ? (titleKo || '공지 및 소식') : (titleEn || 'Board & Updates');

  return (
    <section className="board-section font-pretendard">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="board-header">
          <div>
            <h2 className="board-title">{boardTitle}</h2>
            <p className="board-subtitle">
              {lang === 'ko' 
                ? '뉴코리아 희망방송의 소중한 소식과 공식 업데이트입니다.' 
                : 'Official news and updates from New Korea Hope Broadcasting.'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 text-blue-600 rounded-lg text-xs font-bold border border-gray-100">
            <ShieldCheck size={14} />
            {lang === 'ko' ? '공식 채널' : 'Official Channel'}
          </div>
        </div>

        {/* Board Table */}
        <div className="board-table-container">
          <div className="board-table-header">
            <div>NO.</div>
            <div>{lang === 'ko' ? '제목' : 'TITLE'}</div>
            <div>{lang === 'ko' ? '작성자' : 'AUTHOR'}</div>
            <div>{lang === 'ko' ? '날짜' : 'DATE'}</div>
          </div>

          <div className="board-list">
            {loading ? (
              <div className="py-20 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="board-empty">
                <p>{lang === 'ko' ? '등록된 소식이 없습니다.' : 'No updates have been posted yet.'}</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="board-row"
                  onClick={() => setSelectedPost(post)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="col-num">{posts.length - index}</div>
                  <div className="col-content-wrap">
                    <span className="col-title">
                        {post.title || (post.content.replace(/<[^>]*>/g, '').substring(0, 50) + '...')}
                    </span>
                  </div>
                  <div className="col-author">
                    {post.author_name}
                    <span className="admin-badge">Admin</span>
                  </div>
                  <div className="col-date">
                    {new Date(post.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="post-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="post-modal-content" onClick={e => e.stopPropagation()}>
            <div className="post-modal-header">
              <div className="post-modal-meta w-full">
                <div className="flex justify-between items-start w-full">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                             <ShieldCheck size={20} />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Official Announcement</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                            {selectedPost.title || '소식 안내'}
                        </h3>
                    </div>
                    <button className="post-modal-close" onClick={() => setSelectedPost(null)}>
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            <User size={14} />
                        </div>
                        {selectedPost.author_name}
                    </div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                        <Calendar size={14} />
                        {new Date(selectedPost.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
              </div>
            </div>
            <div className="post-modal-body bg-gray-50/30">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none text-gray-800 leading-relaxed font-medium prose-img:rounded-3xl prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content) }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Board;
