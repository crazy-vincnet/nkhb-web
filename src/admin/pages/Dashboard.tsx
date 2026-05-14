import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Mail, 
  Music, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Files, 
  ChevronRight,
  Layout,
  Clock,
  AlertCircle,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

interface Stats {
  letters: number;
  audio: number;
  posts: number;
  pages: number;
  content: {
    total: number;
    missingEn: number;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        { count: lettersCount },
        { count: audioCount },
        { count: postsCount },
        { count: pagesCount },
        { data: contentData }
      ] = await Promise.all([
        supabase.from('letters').select('*', { count: 'exact', head: true }),
        supabase.from('audio_tracks').select('*', { count: 'exact', head: true }),
        supabase.from('nkhb_posts').select('*', { count: 'exact', head: true }),
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('content').select('value_ko, value_en')
      ]);

      const missingEn = contentData?.filter(item => !item.value_en).length || 0;

      setStats({
        letters: lettersCount || 0,
        audio: audioCount || 0,
        posts: postsCount || 0,
        pages: pagesCount || 0,
        content: {
          total: contentData?.length || 0,
          missingEn
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuCards = [
    { 
      id: 'letters',
      label: '사연 및 편지', 
      desc: '사용자들이 보낸 응원 메시지를 확인하고 관리합니다.',
      icon: Mail, 
      path: '/letters',
      color: 'bg-blue-500',
      stats: stats?.letters,
      statsLabel: '전체 사연'
    },
    { 
      id: 'posts',
      label: '게시글 및 소식', 
      desc: '뉴스, 공지사항, 보도자료 등 게시판 콘텐츠를 관리합니다.',
      icon: MessageSquare, 
      path: '/posts',
      color: 'bg-indigo-500',
      stats: stats?.posts,
      statsLabel: '전체 게시글'
    },
    { 
      id: 'audio',
      label: '오디오 트랙', 
      desc: '방송 음원 파일 및 샘플 듣기 데이터를 업로드하고 관리합니다.',
      icon: Music, 
      path: '/audio',
      color: 'bg-purple-500',
      stats: stats?.audio,
      statsLabel: '전체 음원'
    },
    { 
      id: 'content',
      label: '문구 및 이미지', 
      desc: '사이트의 모든 텍스트, 다국어 번역, 이미지 자산을 한눈에 관리합니다.',
      icon: FileText, 
      path: '/content',
      color: 'bg-emerald-500',
      stats: stats?.content.total,
      statsLabel: '콘텐츠 항목',
      alert: stats?.content.missingEn ? `${stats.content.missingEn}개 미번역` : null
    },
    { 
      id: 'pages',
      label: '서브페이지 관리', 
      desc: '비주얼 에디터를 사용하여 독자적인 레이아웃의 페이지를 생성합니다.',
      icon: Files, 
      path: '/pages',
      color: 'bg-amber-500',
      stats: stats?.pages,
      statsLabel: '전체 페이지'
    },
    { 
      id: 'schedule',
      label: '방송 편성표', 
      desc: '라디오 방송 시간표 및 주파수 정보를 수정하고 관리합니다.',
      icon: Calendar, 
      path: '/schedule',
      color: 'bg-rose-500',
      statsLabel: '편성 관리'
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 font-pretendard pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            NKHB <span className="text-blue-600">Studio</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium">뉴코리아 희망방송 관리 시스템에 오신 것을 환영합니다.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-5 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <Clock className="w-5 h-5 text-blue-600" />
          <div className="text-sm font-bold">
            <span className="text-gray-400">마지막 접속:</span> {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '전체 방문자 (월)', value: '1,240+', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '진행중인 사연', value: stats?.letters || 0, icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: '미번역 항목', value: stats?.content.missingEn || 0, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: '사이트 상태', value: '정상', icon: ExternalLink, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-5">
            <div className={`w-14 h-14 ${stat.bg} dark:bg-gray-700 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Management Cards Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Layout className="w-6 h-6 text-blue-600" />
          콘텐츠 관리 센터
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuCards.map((card) => (
            <button
              key={card.id}
              onClick={() => navigate(card.path)}
              className="group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border-2 border-transparent hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all text-left relative overflow-hidden flex flex-col h-full"
            >
              {/* Background Glow */}
              <div className={`absolute -right-10 -top-10 w-40 h-40 ${card.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full blur-3xl transition-opacity`} />
              
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 ${card.color} text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-current/20`}>
                  <card.icon className="w-8 h-8" />
                </div>
                {card.alert && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black animate-pulse">
                    {card.alert}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {card.label}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.statsLabel}</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{card.stats ?? '-'}</p>
                </div>
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
