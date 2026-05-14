import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, X, Calendar, User, Music, PlayCircle, Headset } from 'lucide-react';
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
  audio_url: string | null;
  post_type: 'news' | 'audio';
  category: string | null;
  created_at: string;
}

interface BoardProps {
  pageId: string;
  lang: 'ko' | 'en';
  titleKo?: string;
  titleEn?: string;
  subtitleKo?: string;
  subtitleEn?: string;
  mode?: 'news' | 'audio';
}

const Board: React.FC<BoardProps> = ({ pageId, lang, titleKo, titleEn, subtitleKo, subtitleEn, mode = 'news' }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [pageId]);

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase
      .from('nkhb_posts')
      .select('id, title, title_ko, title_en, author_name, content, content_ko, content_en, audio_url, post_type, category, created_at')
      .eq('is_approved', true)
      .eq('post_type', mode);

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
      
      // Extract unique categories
      const uniqueCats = Array.from(new Set(data.map(p => p.category).filter(Boolean))) as string[];
      setCategories(uniqueCats);
    }
    setLoading(false);
  };

  const filteredPosts = activeCategory === '전체' || activeCategory === 'All'
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  const getAudioSource = (url: string | null) => {
    if (!url) return null;
    
    // Google Drive direct link conversion
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }
    return url;
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
                {mode === 'audio' ? <Headset size={12} className="mr-1.5" /> : <ShieldCheck size={12} className="mr-1.5" />}
                {mode === 'audio' 
                    ? (lang === 'ko' ? 'BROADCAST AUDIO' : 'BROADCAST AUDIO') 
                    : 'COMMUNITY & NEWS'}
            </div>
            <h2 className="premium-board-title">{boardTitle}</h2>
            <p className="premium-board-subtitle">{boardSubtitle}</p>
          </div>
          
          <div className="board-controls">
            <div className="post-count">
                <span className="count-num">{filteredPosts.length}</span>
                <span className="count-label">{lang === 'ko' ? '개의 콘텐츠' : 'Items'}</span>
            </div>
            {/* Dynamic Filter Pills */}
            <div className="filter-pills">
                <button 
                    className={`pill ${activeCategory === (lang === 'ko' ? '전체' : 'All') ? 'active' : ''}`}
                    onClick={() => setActiveCategory(lang === 'ko' ? '전체' : 'All')}
                >
                    {lang === 'ko' ? '전체' : 'All'}
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat}
                        className={`pill ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
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
          ) : filteredPosts.length === 0 ? (
            <div className="premium-empty-state">
              <div className="empty-icon">📂</div>
              <p>{lang === 'ko' ? '아직 등록된 소식이 없습니다.' : 'No updates have been posted yet.'}</p>
            </div>
          ) : (
            <div className="premium-feed">
              {filteredPosts.map((post, index) => (
                <div 
                  key={post.id} 
                  className="premium-feed-item group"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="item-meta">
                    <div className="item-index">{(filteredPosts.length - index).toString().padStart(2, '0')}</div>
                    <div className="item-date">
                        {new Date(post.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                    </div>
                  </div>

                  <div className="item-main">
                    <div className="item-header">
                        {mode === 'audio' ? (
                            <span className="item-badge audio">
                                <Music size={10} className="mr-1" />
                                {post.category || 'PROGRAM'}
                            </span>
                        ) : (
                            <span className="item-badge">{post.author_name === 'NKHB 관리자' ? 'OFFICIAL' : 'ADMIN'}</span>
                        )}
                        <h4 className="item-title">{getPostTitle(post)}</h4>
                    </div>
                    <p className="item-excerpt">
                        {getPostContent(post).replace(/<[^>]*>/g, '').substring(0, 120)}...
                    </p>
                    <div className="item-footer">
                        <div className="item-author">
                            <div className="author-avatar">{mode === 'audio' ? <PlayCircle size={10} /> : <User size={10} />}</div>
                            {mode === 'audio' ? (lang === 'ko' ? '다시 듣기' : 'Listen Now') : post.author_name}
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
                    {mode === 'audio' ? <Music size={12} className="mr-1.5" /> : <ShieldCheck size={12} className="mr-1.5" />}
                    {mode === 'audio' ? (selectedPost.category || 'Program') : 'Official News'}
                  </div>
                  <h3 className="premium-title">
                    {getPostTitle(selectedPost)}
                  </h3>
                </div>
              </div>

              {/* Audio Player (If audio post) */}
              {mode === 'audio' && selectedPost.audio_url && (
                <div className="premium-audio-player-container px-6 md:px-20 -mt-8 relative z-20">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-indigo-100 dark:border-indigo-900 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                      <PlayCircle size={32} />
                    </div>
                    <div className="flex-1 w-full text-center md:text-left">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Now Playing</p>
                      <h4 className="font-bold text-gray-900 dark:text-white truncate max-w-md">{getPostTitle(selectedPost)}</h4>
                      <audio 
                        controls 
                        className="w-full h-10 mt-4 custom-audio-player"
                        src={getAudioSource(selectedPost.audio_url) || ''}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                </div>
              )}

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
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(getPostContent(selectedPost), {
                        ADD_TAGS: ['iframe', 'style'],
                        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
                      }) 
                    }}
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
