import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import Login from './pages/Login';

// Lazy-load route components so heavy editors (GrapesJS, Tiptap) split into their
// own chunks instead of bloating the initial admin bundle.
const Letters = lazy(() => import('./pages/Letters'));
const Audio = lazy(() => import('./pages/Audio'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Content = lazy(() => import('./pages/Content'));
const SEO = lazy(() => import('./pages/SEO'));
const Menu = lazy(() => import('./pages/Menu'));
const Pages = lazy(() => import('./pages/Pages'));
const PageEditor = lazy(() => import('./pages/PageEditor'));
const Posts = lazy(() => import('./pages/Posts'));
const PostEditor = lazy(() => import('./pages/PostEditor'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen text-gray-400">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router basename="/admin">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />

          {/* Full-screen Editor Route */}
          <Route
            path="/editor/:id"
            element={session ? <PageEditor /> : <Navigate to="/login" />}
          />

          <Route
            path="/"
            element={session ? <Layout /> : <Navigate to="/login" />}
          >
            <Route index element={<Dashboard />} />
            <Route path="letters" element={<Letters />} />
            <Route path="audio" element={<Audio />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="menu" element={<Menu />} />
            <Route path="pages" element={<Pages />} />
            <Route path="posts" element={<Posts />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/edit/:id" element={<PostEditor />} />
            <Route path="content" element={<Content />} />
            <Route path="seo" element={<SEO />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
