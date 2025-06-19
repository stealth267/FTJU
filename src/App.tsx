import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DrawdownVisualizerPage from './pages/DrawdownVisualizerPage';
import type { Theme } from './types'; // Adjusted path

// AppProps might be needed if AppLayoutProps had content
// export interface AppProps {}

const App: React.FC = () => { // Renamed from AppLayout
    const [theme, setTheme] = React.useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    const [activeMarket, setActiveMarket] = React.useState<'CFD' | 'Futures'>('Futures');

    React.useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    return (
        <div className="app-container">
            <Navbar activeMarket={activeMarket} onMarketChange={setActiveMarket} theme={theme} onToggleTheme={toggleTheme} />
            <Routes>
                <Route path="/" element={<HomePage activeMarket={activeMarket} />} />
                <Route path="/drawdown-visualizer" element={<DrawdownVisualizerPage />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;
