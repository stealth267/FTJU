import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogoSvgIcon, SunIcon, MoonIcon } from '@/components/common/Icons';
import type { Theme } from '@/types';
import { defaultNavLinks } from '@/utils/constants';

export interface NavbarProps {
    activeMarket: 'CFD' | 'Futures';
    onMarketChange: (market: 'CFD' | 'Futures') => void;
    theme: Theme;
    onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    activeMarket,
    onMarketChange,
    theme,
    onToggleTheme,
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const showMarketToggle = currentPath === '/'; // Only show on homepage
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    React.useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <header className="header">
            <div className="container">
                <div className="logo-container">
                    <LogoSvgIcon />
                    <Link to="/" className="logo-text">FuturesFlow</Link>
                </div>
                <div className="header-center">
                    <nav className="nav desktop-nav" aria-label="Main navigation">
                        <ul>
                            {defaultNavLinks.map(link => (
                                <li key={link.text}>
                                    <Link
                                        to={link.to}
                                        className={currentPath === link.to ? 'active' : ''}
                                    >
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="header-right">
                    <button
                        onClick={onToggleTheme}
                        className="btn theme-toggle-btn"
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    {showMarketToggle && (
                         <div className="market-toggle">
                            <button
                                onClick={() => onMarketChange('CFD')}
                                className={activeMarket === 'CFD' ? 'active' : ''}
                                aria-pressed={activeMarket === 'CFD'}
                            >
                                CFD
                            </button>
                            <button
                                onClick={() => onMarketChange('Futures')}
                                className={activeMarket === 'Futures' ? 'active' : ''}
                                aria-pressed={activeMarket === 'Futures'}
                            >
                                Futures
                            </button>
                        </div>
                    )}
                    <div className="auth-buttons">
                        <button className="btn btn-secondary">Log in</button>
                        <button className="btn btn-primary">Sign up</button>
                    </div>
                    <button
                        className="menu-icon"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isMobileMenuOpen}
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <>&times;</> : <>&#9776;</>}
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="mobile-nav-panel-overlay" onClick={toggleMobileMenu}>
                    <div className="mobile-nav-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-nav-header">
                            <button onClick={toggleMobileMenu} className="close-menu-btn" aria-label="Close menu">&times;</button>
                        </div>
                        <nav className="mobile-nav">
                            <ul>
                                {defaultNavLinks.map(link => (
                                    <li key={`mobile-${link.text}`}>
                                        <Link
                                            to={link.to}
                                            className={currentPath === link.to ? 'active' : ''}
                                            onClick={toggleMobileMenu}
                                        >
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        {/* Optionally, add mobile-specific auth buttons or theme toggle here if design differs */}
                    </div>
                </div>
            )}
        </header>
    );
};
