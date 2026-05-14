import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Layout from './components/Layout';
import Login from './pages/Login';
import Letters from './pages/Letters';
import Audio from './pages/Audio';
import Schedule from './pages/Schedule';
import Content from './pages/Content';
import SEO from './pages/SEO';
import Menu from './pages/Menu';
import Pages from './pages/Pages';
import PageEditor from './pages/PageEditor';
import Posts from './pages/Posts';
import PostEditor from './pages/PostEditor';
import Dashboard from './pages/Dashboard';

function App() {
  const [session, setSession] = useState<any>(null);
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
    </Router>
  );
}

export default App;
