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
  subtitleKo?: string;
  subtitleEn?: string;
}

const Board: React.FC<BoardProps> = ({ pageId, lang, titleKo, titleEn, subtitleKo, subtitleEn }) => {
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
  const boardSubtitle = lang === 'ko' 
    ? (subtitleKo || '뉴코리아 희망방송의 소중한 소식과 공식 업데이트를 전해드립니다.') 
    : (subtitleEn || 'Delivering valuable news and official updates from NKHB.');

  return (
    <section className="premium-board-section font-pretendard">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Premium Board Header */}
        <div className="premium-board-header">
          <div className="header-top">
            <div className="category-tag">
                <ShieldCheck size={12} className="mr-1.5" />
                COMMUNITY & NEWS
            </div>
            <h2 className="premium-board-title">{boardTitle}</h2>
            <p className="premium-board-subtitle">{boardSubtitle}</p>
          </div>
          
          <div className="board-controls">
            <div className="post-count">
                <span className="count-num">{posts.length}</span>
                <span className="count-label">{lang === 'ko' ? '개의 소식' : 'Updates'}</span>
            </div>
            {/* Filter Pills Simulation */}
            <div className="filter-pills">
                <button className="pill active">{lang === 'ko' ? '전체' : 'All'}</button>
                <button className="pill">{lang === 'ko' ? '공지' : 'Notice'}</button>
                <button className="pill">{lang === 'ko' ? '소식' : 'News'}</button>
            </div>
          </div>
        </div>

        {/* Premium List View */}
        <div className="premium-list-container">
          {loading ? (
            <div className="py-32 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto opacity-50"></div>
              <p className="mt-4 text-gray-400 font-bold text-sm tracking-widest uppercase">Loading Contents...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="premium-empty-state">
              <div className="empty-icon">📂</div>
              <p>{lang === 'ko' ? '아직 등록된 소식이 없습니다.' : 'No updates have been posted yet.'}</p>
            </div>
          ) : (
            <div className="premium-feed">
              {posts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="premium-feed-item group"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="item-meta">
                    <div className="item-index">{(posts.length - index).toString().padStart(2, '0')}</div>
                    <div className="item-date">
                        {new Date(post.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                    </div>
                  </div>

                  <div className="item-main">
                    <div className="item-header">
                        <span className="item-badge">{post.author_name === 'NKHB 관리자' ? 'OFFICIAL' : 'ADMIN'}</span>
                        <h4 className="item-title">{getPostTitle(post)}</h4>
                    </div>
                    <p className="item-excerpt">
                        {getPostContent(post).replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                    <div className="item-footer">
                        <div className="item-author">
                            <div className="author-avatar"><User size={10} /></div>
                            {post.author_name}
                        </div>
                        <div className="read-more">
                            {lang === 'ko' ? '자세히 보기' : 'Read More'}
                            <X size={14} className="rotate-45 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                  </div>
                  
                  {/* Decorative background on hover */}
                  <div className="item-hover-bg"></div>
                </div>
              ))}
            </div>
          )}
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
