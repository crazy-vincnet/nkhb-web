import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Home,
  Mail, 
  Music, 
  Calendar, 
  FileText, 
  LogOut,
  Search,
  Menu as MenuIcon,
  Files,
  MessageSquare
} from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/letters', icon: Mail, label: 'Letters' },
    { path: '/audio', icon: Music, label: 'Audio Tracks' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/menu', icon: MenuIcon, label: 'Menu' },
    { path: '/pages', icon: Files, label: 'Pages' },
    { path: '/posts', icon: MessageSquare, label: 'Posts' },
    { path: '/content', icon: FileText, label: 'Content' },
    { path: '/seo', icon: Search, label: 'SEO' },
  ];

  // Determine if we are on the content editor page
  const isContentEditor = location.pathname === '/content';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-pretendard overflow-hidden">
      {/* Sidebar - Hidden in content editor to maximize space */}
      {!isContentEditor && (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 relative">
          <div className="p-6">
            <h1 className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">NKHB Studio</h1>
          </div>
          <nav className="mt-2 px-3">
            {menuItems.map((item) => {
              const isActive = item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.path);
                
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 mb-1 rounded-xl font-bold transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${isContentEditor ? 'p-0' : 'p-8'}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
