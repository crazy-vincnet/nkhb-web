import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, ArrowRight, Info } from 'lucide-react';
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
    <section className="board-section">
      <div className="container">
        {/* Header Section */}
        <div className="board-header">
          <div className="board-tag">
            <ShieldCheck size={14} />
            {lang === 'ko' ? '공식 소식 창구' : 'Official Channel'}
          </div>
          <h2 className="board-title">
            {boardTitle}
          </h2>
          <p className="board-subtitle">
            {lang === 'ko' 
              ? '뉴코리아 희망방송의 소중한 소식과 공식 업데이트를 전해드립니다.' 
              : 'Delivering official updates and precious news from New Korea Hope Broadcasting.'}
          </p>
        </div>

        {/* Post List */}
        <div className="board-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="board-empty">
              <span className="board-empty-icon">📢</span>
              <p>{lang === 'ko' ? '아직 등록된 소식이 없습니다.' : 'No updates have been posted yet.'}</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="board-item">
                <div className="board-item-header">
                  <div className="board-meta">
                    <div className="board-avatar">
                      {post.author_name.charAt(0)}
                    </div>
                    <div className="board-author-info">
                      <h4>
                        {post.author_name}
                        <span className="admin-badge">Admin</span>
                      </h4>
                      <div className="board-date">
                        {new Date(post.created_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="board-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                />

                <div style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: '#2563eb', opacity: 0.6 }}>
                    <Info size={14} /> NKHB OFFICIAL MESSAGE
                </div>
              </div>
            ))
          )}
        </div>

        {/* Support Banner */}
        <div className="board-support-banner">
            <h3>북한의 밤에 진실의 빛을 비춰주세요</h3>
            <p>여러분의 작은 정성이 모여 북한 주민들에게 희망의 전파가 전달됩니다. 지금 바로 사역에 동참하여 큰 변화를 만들어주세요.</p>
            <div style={{ marginTop: '40px' }}>
                <a href="/#support" className="btn-board-cta">
                    후원 안내 자세히 보기 <ArrowRight size={18} />
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Board;
