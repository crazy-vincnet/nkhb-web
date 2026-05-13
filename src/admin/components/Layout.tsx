import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Mail, 
  Music, 
  Calendar, 
  FileText, 
  LogOut,
  Search
} from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/letters', icon: Mail, label: 'Letters' },
    { path: '/audio', icon: Music, label: 'Audio Tracks' },
    { path: '/schedule', icon: Calendar, label: 'Schedule' },
    { path: '/content', icon: FileText, label: 'Content' },
    { path: '/seo', icon: Search, label: 'SEO' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">NKHB Admin</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                location.pathname === item.path ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
