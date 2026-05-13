import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
            <div className="text-center">NO.</div>
            <div>{lang === 'ko' ? '내용' : 'CONTENT'}</div>
            <div>{lang === 'ko' ? '작성자' : 'AUTHOR'}</div>
            <div className="text-right">{lang === 'ko' ? '날짜' : 'DATE'}</div>
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
              posts.map((post, index) => {
                const isExpanded = expandedId === post.id;
                return (
                  <React.Fragment key={post.id}>
                    <div 
                      className={`board-row ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleExpand(post.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="col-num">{posts.length - index}</div>
                      <div className="col-content-wrap">
                        <span className="col-title">
                          <span className="line-clamp-1">{post.content.replace(/<[^>]*>/g, '').substring(0, 80)}...</span>
                        </span>
                        {!isExpanded && (
                          <div 
                            className="board-content-preview"
                            dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150).replace(/<[^>]*>/g, '') }}
                          />
                        )}
                      </div>
                      <div className="col-author flex items-center gap-2">
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
                      
                      {/* Mobile Arrow */}
                      <div className="md:hidden flex justify-end pt-2">
                         {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="expanded-content animate-in slide-in-from-top-2 duration-300">
                        <div 
                          className="prose prose-lg dark:prose-invert max-w-none text-gray-800 leading-relaxed font-medium"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Board;
