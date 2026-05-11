import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import { useI18n } from './lib/i18n';

const App: React.FC = () => {
    const { lang } = useI18n();

    return (
        <Router>
            <div className={`app-container ${lang}`}>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
