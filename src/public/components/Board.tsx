import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, X, Calendar, User } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Post {
  id: string;
  title: string | null;
  title_ko: string | null;
  title_en: string | null;
  author_name: string;
  content: string;
  content_ko: string | null;
  content_en: string | null;
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
      .select('id, title, title_ko, title_en, author_name, content, content_ko, content_en, created_at')
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

  const getPostTitle = (post: Post) => {
    if (lang === 'ko') {
      return post.title_ko || post.title || post.title_en || (post.content_ko || post.content || post.content_en || '').replace(/<[^>]*>/g, '').substring(0, 50) + '...';
    } else {
      return post.title_en || post.title || post.title_ko || (post.content_en || post.content || post.content_ko || '').replace(/<[^>]*>/g, '').substring(0, 50) + '...';
    }
  };

  const getPostContent = (post: Post) => {
    if (lang === 'ko') {
      return post.content_ko || post.content || post.content_en || '';
    } else {
      return post.content_en || post.content || post.content_ko || '';
    }
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
                        {getPostTitle(post)}
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

      {/* Premium Post Detail Modal */}
      {selectedPost && (
        <div className="premium-post-overlay" onClick={() => setSelectedPost(null)}>
          <div className="premium-post-container" onClick={e => e.stopPropagation()}>
            {/* Reading Progress Bar */}
            <div className="reading-progress-bar"></div>

            {/* Close Button (Floating) */}
            <button className="premium-close-btn" onClick={() => setSelectedPost(null)}>
              <X size={20} />
            </button>

            <div className="premium-post-scroll-area">
              {/* Hero Section */}
              <div className="premium-hero">
                <div className="premium-hero-bg"></div>
                <div className="premium-hero-content">
                  <div className="premium-category-badge">
                    <ShieldCheck size={12} className="mr-1.5" />
                    Official News
                  </div>
                  <h3 className="premium-title">
                    {getPostTitle(selectedPost)}
                  </h3>
                </div>
              </div>

              {/* Main Content Layout */}
              <div className="premium-main-layout">
                {/* Side Meta */}
                <aside className="premium-meta-side">
                  <div className="meta-card">
                    <div className="meta-item">
                      <div className="meta-icon"><User size={16} /></div>
                      <div className="meta-text">
                        <label>{lang === 'ko' ? '작성자' : 'Author'}</label>
                        <span>{selectedPost.author_name}</span>
                      </div>
                    </div>
                    <div className="meta-item">
                      <div className="meta-icon"><Calendar size={16} /></div>
                      <div className="meta-text">
                        <label>{lang === 'ko' ? '발행일' : 'Date'}</label>
                        <span>
                          {new Date(selectedPost.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="premium-action-list">
                    <button className="premium-action-btn" onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert(lang === 'ko' ? '링크가 복사되었습니다.' : 'Link copied to clipboard.');
                    }}>
                        {lang === 'ko' ? '공유하기' : 'Share Link'}
                    </button>
                  </div>
                </aside>

                {/* Content Body */}
                <article className="premium-body">
                  <div 
                    className="prose prose-xl dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getPostContent(selectedPost)) }}
                  />
                  
                  {/* Bottom Guide */}
                  <div className="premium-footer-guide">
                    <div className="guide-divider"></div>
                    <p>
                        {lang === 'ko' 
                          ? '뉴코리아 희망방송은 여러분의 후원과 기도로 함께 만들어갑니다.' 
                          : 'New Korea Hope Broadcasting is built together with your support and prayers.'}
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Board;
