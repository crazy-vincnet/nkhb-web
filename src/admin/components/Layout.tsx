import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard,
  MessageSquare,
  Mail,
  Files,
  PenTool,
  Settings,
  Search,
  Database,
  ExternalLink,
  LogOut,
  User
} from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: '대시보드' },
    { path: '/posts', icon: MessageSquare, label: '게시글 관리' },
    { path: '/letters', icon: Mail, label: '뉴스레터 구독자' },
    { path: '/pages', icon: Files, label: '페이지 빌더' },
    { path: '/content', icon: PenTool, label: '콘텐츠 편집', hasUpdate: true },
    { path: '/design', icon: Settings, label: '디자인 설정' },
    { path: '/seo', icon: Search, label: 'SEO 설정' },
    { path: '/storage', icon: Database, label: '스토리지 관리' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-pretendard">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xl italic">NK</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none tracking-tighter">NKFI</h1>
              <p className="text-[10px] font-bold text-gray-400 mt-1">뉴코리아 파운데이션<br/>인터내셔널</p>
            </div>
            <div className="ml-auto">
                <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded uppercase">관리자</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.path === '/' 
              ? location.pathname === '/' 
              : location.pathname.startsWith(item.path);
              
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-5 py-3.5 rounded-2xl text-sm font-bold transition-all relative group ${
                  isActive 
                    ? 'bg-gray-50 text-gray-900 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                }`}
              >
                <item.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-[#E67E5F]' : 'text-gray-300 group-hover:text-gray-400'}`} />
                {item.label}
                {item.hasUpdate && (
                  <span className="absolute right-5 w-1.5 h-1.5 rounded-full bg-[#E67E5F]" />
                )}
                {isActive && (
                  <div className="absolute left-0 w-1 h-5 bg-[#E67E5F] rounded-r-full" />
                )}
              </Link>
            );
          })}

          <div className="pt-8 pb-4 px-5">
            <h3 className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-4">바로가기</h3>
            <div className="space-y-1">
                <a href="/" target="_blank" className="flex items-center px-0 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all">
                    <ExternalLink className="w-4 h-4 mr-3 opacity-50" />
                    메인 페이지
                </a>
                <a href="/posts" target="_blank" className="flex items-center px-0 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-all">
                    <ExternalLink className="w-4 h-4 mr-3 opacity-50" />
                    게시판
                </a>
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-50">
          <div className="bg-gray-50 rounded-[1.5rem] p-5 mb-4">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate">Administrator</p>
                    <p className="text-[10px] font-medium text-gray-400 truncate">admin@nkfoundation.com</p>
                </div>
                <button onClick={handleLogout} className="text-gray-300 hover:text-red-500 transition-colors">
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                <span>세션 만료까지 49분 남음</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
