/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './styles/global.css';

// --- INTERFACES ---
interface Platform {
    name: string;
    iconId?: string;
}
interface Promo {
    text: string;
    code: string | null;
}
interface EvaluationProgram {
    id: number;
    programId: string;
    name: string;
    price?: number | null;
    profitTarget?: string | null;
    maxTotalLoss?: string | null;
    drawdownType?: string | null;
    dailyLossLimit?: string | null;
    maxContracts?: string | null;
    consistencyRules?: string | null;
    minTradingDays?: string | null;
    keyRestrictions?: string | null;
    maxDrawdown?: string | null;
    maxPositions?: string | null;
    profitSplit?: string | null;
    scalingPlan?: string | null;
    resetFee?: string | null;
    oneTimeFee?: string | null;
    leverage?: string | null;
}
interface FirmData {
    id: number;
    logoUrl: string;
    name: string;
    likes: number;
    rating: number;
    reviews: number;
    country: string;
    countryFlag: string;
    yearsInOp: number;
    assets: string[];
    platforms: Platform[];
    maxAllocation: number;
    promo: Promo | null;
    marketType: 'Futures' | 'CFD';
    description: string;
    minDeposit: number;
    profitSplit: string;
    evaluationPrograms?: EvaluationProgram[];
}
interface AllocationRange {
    label: string;
    min: number;
    max: number;
}
interface YearsRange {
    label: string;
    min: number;
    max: number;
}
interface AdvancedFiltersState {
    platforms: string[];
    allocation: (AllocationRange & { id: string }) | null;
    countries: string[];
    years: (YearsRange & { id: string }) | null;
    promotionsOnly: boolean;
}
interface ProgramToCompare {
    firmId: number;
    programId: string;
}
interface DetailedProgramToCompare extends EvaluationProgram {
    firmId: number;
    firmName: string;
    firmLogoUrl: string;
}

// --- CONSTANTES Y COMPONENTES VISUALES ---
const initialAdvancedFilters: AdvancedFiltersState = { platforms: [], allocation: null, countries: [], years: null, promotionsOnly: false };
const allocationRanges: (AllocationRange & { id: string })[] = [ { id: 'alloc_any', label: "Any Amount", min: 0, max: Infinity }, { id: 'alloc_lt50', label: "< $50K", min: 0, max: 49999 }, { id: 'alloc_50_150', label: "$50K - $150K", min: 50000, max: 150000 }, { id: 'alloc_150_300', label: "$150K - $300K", min: 150001, max: 300000 }, { id: 'alloc_gt300', label: "> $300K", min: 300001, max: Infinity }, ];
const yearsRanges: (YearsRange & { id: string })[] = [ { id: 'years_any', label: "Any Experience", min: 0, max: Infinity }, { id: 'years_0_1', label: "0-1 Years", min: 0, max: 1 }, { id: 'years_2_4', label: "2-4 Years", min: 2, max: 4 }, { id: 'years_5plus', label: "5+ Years", min: 5, max: Infinity }, ];

const FavoriteToggleIcon: React.FC<{isFavorite: boolean; size?: string}> = ({ isFavorite, size = "1.3em" }) => ( <svg viewBox="0 0 24 24" fill={isFavorite ? "var(--icon-heart-color)" : "none"} stroke="var(--icon-heart-color)" strokeWidth="2" aria-hidden="true" style={{ width: size, height: size }}> <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/> </svg> );
const SunIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM12 4c.55 0 1-.45 1-1V1c0-.55-.45-1-1-1s-1 .45-1 1v2c0 .55.45 1 1 1zm0 16c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1zm7.07-14.93c-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.02 0 1.41.2.2.45.29.71.29s.51-.1.71-.29l1.41-1.41c.39-.39.39-1.02 0-1.41zm-11.31 0c.39-.39.39-1.02 0-1.41l-1.41-1.41c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l1.41 1.41c.2.2.45.29.71.29s.51-.1.71-.29zM20 12c0-.55-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1-.45 1-1zm-16 0c0 .55.45 1 1 1h2c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1 .45-1 1zm11.31 4.24c.39.39 1.02.39 1.41 0l1.41-1.41c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0l-1.41 1.41c-.39.39-.39 1.02 0 1.41.2.2.45.29.71.29s.51-.1.71-.29zm-8.48 0c-.39-.39-1.02-.39-1.41 0l-1.41-1.41c-.39-.39-.39-1.02 0-1.41s1.02-.39 1.41 0l1.41 1.41c.39.39.39 1.02 0 1.41.2.19.46.29.71.29.25 0 .51-.1.71-.29z"/></svg>;
const MoonIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10S22 17.52 22 12C22 6.48 17.52 2 11.99 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.71-11.99c-.19-.11-.42-.11-.61 0-.61.35-1.16.8-1.6 1.32-.45.52-.78 1.13-1 1.78-.17.53.01 1.1.42 1.48.42.39.99.53 1.5.4.56-.12 1.09-.44 1.52-.88.43-.44.75-1 .92-1.58.17-.59-.01-1.21-.42-1.6-.04-.04-.09-.07-.12-.1z"/></svg>;
const LogoSvgIcon: React.FC = () => <svg width="32" height="32" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg-icon" aria-hidden="true"><rect width="36" height="36" rx="6" fill="var(--app-primary-color)"/><rect x="7" y="9" width="10" height="3" rx="1.5" fill="var(--logo-accent-color)"/><rect x="7" y="16.5" width="22" height="3" rx="1.5" fill="var(--logo-accent-color)"/><rect x="15" y="24" width="14" height="3" rx="1.5" fill="var(--logo-accent-color)"/></svg>;
const FilterIcon: React.FC = () => <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
const ScaleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true"><path d="M19.947 7.514a1 1 0 00-.947-.514H5a1 1 0 00-.947.514L1 12l3.053 4.486A1 1 0 005 17.5h14a1 1 0 00.947-1.014L23 12l-3.053-4.486zM5.472 15.5L3.32 12l2.152-3.5H18.528L20.68 12l-2.152 3.5H5.472zM12 3a1 1 0 00-1 1v2.586l-2.293-2.293a1 1 0 10-1.414 1.414L10.586 9H7a1 1 0 000 2h3.586l-3.293 3.293a1 1 0 101.414 1.414L11 13.414V16a1 1 0 002 0v-2.586l2.293 2.293a1 1 0 101.414-1.414L13.414 11H17a1 1 0 000-2h-3.586l3.293-3.293a1 1 0 10-1.414-1.414L13 7.586V4a1 1 0 00-1-1z"/></svg>;
const CTraderIcon: React.FC = () => <svg viewBox="0 0 24 24" className="platform-svg-icon"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>;
const DXtradeIcon: React.FC = () => <svg viewBox="0 0 24 24" className="platform-svg-icon"><path fill="currentColor" d="M6 6h12v12H6V6zm2 2v8h8V8H8z"/></svg>;
const MT4Icon: React.FC = () => <svg viewBox="0 0 24 24" className="platform-svg-icon"><path fill="currentColor" d="M4 4h16v2H4zm0 5h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>;
const MT5Icon: React.FC = () => <svg viewBox="0 0 24 24" className="platform-svg-icon"><path fill="currentColor" d="M3 3h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3zm0 4h18v2H3z"/></svg>;
const TradingViewIcon: React.FC = () => <svg viewBox="0 0 24 24" className="platform-svg-icon" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
const NinjaTraderIcon: React.FC = () => <svg viewBox="0 0 24 24" className="platform-svg-icon" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M12 6v12M6 12h12"/></svg>;

const PlatformDisplay: React.FC<{ platform: Platform; small?: boolean }> = ({ platform, small = false }) => {
    if (!platform || !platform.name) return null;
    const getIconIdFromName = (name: string): string => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('ninjatrader')) return 'NT';
        if (lowerName.includes('tradingview')) return 'TV';
        if (lowerName.includes('tradovate')) return 'Tradovate';
        if (lowerName.includes('rithmic')) return 'Rithmic';
        if (lowerName.includes('topstep')) return 'TopstepX';
        if (lowerName.includes('ctrader')) return 'cTrader';
        if (lowerName.includes('dxtrade')) return 'DXtrade';
        if (lowerName.includes('mt4')) return 'MT4';
        if (lowerName.includes('mt5')) return 'MT5';
        const parts = name.split(' ');
        if (parts.length > 1) return parts.map(p => p[0]).join('').toUpperCase();
        return name.substring(0, 2).toUpperCase();
    }
    const iconId = platform.iconId || getIconIdFromName(platform.name);
    let IconComponent;
    switch (iconId.toLowerCase()) {
        case 'ctrader': IconComponent = CTraderIcon; break;
        case 'dxtrade': IconComponent = DXtradeIcon; break;
        case 'mt4': IconComponent = MT4Icon; break;
        case 'mt5': IconComponent = MT5Icon; break;
        case 'tv': IconComponent = TradingViewIcon; break;
        case 'nt': IconComponent = NinjaTraderIcon; break;
        default: IconComponent = () => <span className={`platform-text-icon ${small ? 'small' : ''}`}>{iconId.substring(0, small ? 2 : 3).toUpperCase()}</span>;
    }
    return (
        <div className={`platform-item ${small ? 'small' : ''}`} title={platform.name} aria-label={platform.name}>
            <IconComponent />
            {!small && <span className="platform-name-tooltip">{platform.name}</span>}
        </div>
    );
};
const MAX_FIRM_COMPARE_ITEMS = 4;
const MAX_PROGRAM_COMPARE_ITEMS = 4;
type Theme = 'light' | 'dark';
const defaultNavLinks = [ { to: "/", text: "Home" }, { to: "/#offers", text: "Offers" }, { to: "/#best-firms", text: "Best Firms" }, { to: "/#reviews", text: "Reviews" }, { to: "/#rules", text: "Rules" }, { to: "/#brokers", text: "Brokers" }, { to: "/drawdown-visualizer", text: "Drawdown Visualizer" }, ];
const characteristicsMap: Array<{ key: keyof EvaluationProgram; label: string }> = [ { key: 'profitTarget', label: 'Profit Target' }, { key: 'maxTotalLoss', label: 'Max Total Loss' }, { key: 'drawdownType', label: 'Drawdown Type' }, { key: 'dailyLossLimit', label: 'Daily Loss Limit' }, { key: 'maxContracts', label: 'Max Contracts' }, { key: 'consistencyRules', label: 'Consistency Rules' }, { key: 'minTradingDays', label: 'Min. Trading Days' }, { key: 'keyRestrictions', label: 'Key Restrictions' }, ];
const formatCurrency = (value: number) => { return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }); };
const formatAllocation = (amount: number) => `$${(amount / 1000)}K`;

const DrawdownVisualizer: React.FC = () => {
    type DrawdownType = 'static' | 'trailing_intraday' | 'trailing_eod';
    const [accountBalanceInput, setAccountBalanceInput] = React.useState<string>('50000');
    const [drawdownType, setDrawdownType] = React.useState<DrawdownType>('trailing_intraday');
    const [drawdownValueInput, setDrawdownValueInput] = React.useState<string>('2000');
    const [currentEquityInput, setCurrentEquityInput] = React.useState<string>('50000');
    const [initialAccountBalance, setInitialAccountBalance] = React.useState<number>(parseFloat(accountBalanceInput) || 0);
    const [maxEquityReached, setMaxEquityReached] = React.useState<number>(parseFloat(accountBalanceInput) || 0);
    const parsedAccountBalance = parseFloat(accountBalanceInput) || 0;
    const parsedDrawdownValue = parseFloat(drawdownValueInput) || 0;
    const parsedCurrentEquity = parseFloat(currentEquityInput) || 0;

    React.useEffect(() => {
        const newBalanceNum = parseFloat(accountBalanceInput) || 0;
        setInitialAccountBalance(newBalanceNum);
        setMaxEquityReached(newBalanceNum);
        setCurrentEquityInput(accountBalanceInput);
    }, [accountBalanceInput]);

    React.useEffect(() => {
        if (drawdownType === 'trailing_intraday' || drawdownType === 'trailing_eod') {
            const currentEquityNum = parseFloat(currentEquityInput) || 0;
            if (currentEquityNum > maxEquityReached) {
                setMaxEquityReached(currentEquityNum);
            }
        }
    }, [currentEquityInput, drawdownType, maxEquityReached]);

    React.useEffect(() => {
        const currentEquityNum = parseFloat(currentEquityInput) || 0;
        const baseBalance = parsedAccountBalance;
        if (drawdownType === 'trailing_intraday' || drawdownType === 'trailing_eod') {
            setMaxEquityReached(Math.max(currentEquityNum, baseBalance));
        }
    }, [drawdownType, currentEquityInput, parsedAccountBalance]);

    let calculatedDrawdownLimit = 0;
    if (drawdownType === 'static') {
        calculatedDrawdownLimit = initialAccountBalance - parsedDrawdownValue;
    } else {
        calculatedDrawdownLimit = maxEquityReached - parsedDrawdownValue;
    }

    const isBreached = parsedCurrentEquity < calculatedDrawdownLimit;
    const buffer = parsedCurrentEquity - calculatedDrawdownLimit;
    let statusMessage = isBreached ? 'BREACHED' : 'SAFE';

    const getDrawdownTypeExplanation = (type: DrawdownType) => {
        switch(type) {
            case 'static': return 'Limit is fixed based on initial balance.';
            case 'trailing_intraday': return 'Limit trails the highest intraday equity peak.';
            case 'trailing_eod': return 'Limit trails the highest equity peak (updates dynamically here; in reality, often based on end-of-day balance).';
            default: return '';
        }
    };

    return (
        <section className="drawdown-visualizer-section">
            <div className="container">
                <h2>Interactive Drawdown Visualizer</h2>
                <div className="visualizer-grid">
                    <div className="visualizer-inputs">
                        <h3>Parameters</h3>
                        <div className="form-group">
                            <label htmlFor="accountBalance">Account Balance:</label>
                            <input type="number" id="accountBalance" value={accountBalanceInput} onChange={(e) => setAccountBalanceInput(e.target.value)} placeholder="e.g., 50000" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="drawdownType">Drawdown Type:</label>
                            <select id="drawdownType" value={drawdownType} onChange={(e) => setDrawdownType(e.target.value as DrawdownType)}>
                                <option value="static">Static</option>
                                <option value="trailing_intraday">Trailing Intraday</option>
                                <option value="trailing_eod">Trailing EOD</option>
                            </select>
                             <small className="input-hint">{getDrawdownTypeExplanation(drawdownType)}</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="drawdownValue">Drawdown Value:</label>
                            <input type="number" id="drawdownValue" value={drawdownValueInput} onChange={(e) => setDrawdownValueInput(e.target.value)} placeholder="e.g., 2000" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="currentEquity">Current Equity:</label>
                            <input type="number" id="currentEquity" value={currentEquityInput} onChange={(e) => setCurrentEquityInput(e.target.value)} placeholder="e.g., 51000" />
                        </div>
                    </div>
                    <div className="visualizer-results">
                        <h3>Calculation Results</h3>
                        <div className="result-item"><span className="result-label">Initial Account Balance:</span><span className="result-value">{formatCurrency(initialAccountBalance)}</span></div>
                        {(drawdownType === 'trailing_intraday' || drawdownType === 'trailing_eod') && (<div className="result-item"><span className="result-label">Max Equity Reached:</span><span className="result-value">{formatCurrency(maxEquityReached)}</span></div>)}
                        <div className="result-item"><span className="result-label">Drawdown Limit Balance:</span><span className="result-value strong">{formatCurrency(calculatedDrawdownLimit)}</span></div>
                        <div className="result-item"><span className="result-label">Current Equity:</span><span className="result-value">{formatCurrency(parsedCurrentEquity)}</span></div>
                        <div className="result-item"><span className="result-label">Buffer:</span><span className={`result-value buffer ${buffer >= 0 ? 'safe' : 'breached'}`}>{formatCurrency(buffer)}</span></div>
                        <div className="result-item status-item"><span className="result-label">Status:</span><span className={`result-value status ${isBreached ? 'breached' : 'safe'}`}>{statusMessage}</span></div>
                    </div>
                </div>
            </div>
        </section>
    );
};


interface HeaderProps {
    activeMarket: 'CFD' | 'Futures';
    onMarketChange: (market: 'CFD' | 'Futures') => void;
    theme: Theme;
    onToggleTheme: () => void;
}
const Header: React.FC<HeaderProps> = ({
    activeMarket,
    onMarketChange,
    theme,
    onToggleTheme,
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const location = useLocation();
    const currentPath = location.pathname;
    const showMarketToggle = currentPath === '/';
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    React.useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
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
                                    <Link to={link.to} className={currentPath === link.to ? 'active' : ''}>
                                        {link.text}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="header-right">
                    <button onClick={onToggleTheme} className="btn theme-toggle-btn" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    {showMarketToggle && (
                         <div className="market-toggle">
                            <button onClick={() => onMarketChange('CFD')} className={activeMarket === 'CFD' ? 'active' : ''} aria-pressed={activeMarket === 'CFD'}>CFD</button>
                            <button onClick={() => onMarketChange('Futures')} className={activeMarket === 'Futures' ? 'active' : ''} aria-pressed={activeMarket === 'Futures'}>Futures</button>
                        </div>
                    )}
                    <div className="auth-buttons">
                        <button className="btn btn-secondary">Log in</button>
                        <button className="btn btn-primary">Sign up</button>
                    </div>
                    <button className="menu-icon" aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={isMobileMenuOpen} onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <>&times;</> : <>&#9776;</>}
                    </button>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="mobile-nav-panel-overlay" onClick={toggleMobileMenu}>
                    <div className="mobile-nav-panel" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-nav-header"><button onClick={toggleMobileMenu} className="close-menu-btn" aria-label="Close menu">&times;</button></div>
                        <nav className="mobile-nav">
                            <ul>
                                {defaultNavLinks.map(link => (
                                    <li key={`mobile-${link.text}`}>
                                        <Link to={link.to} className={currentPath === link.to ? 'active' : ''} onClick={toggleMobileMenu}>
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
};

const SimplifiedHeroSection: React.FC = () => {
    return (
        <section className="hero-simple">
            <div className="container">
                <h1>Navigate Your Trading Future</h1>
                <p>Discover, compare, and connect with top-tier prop firms. Find your perfect match.</p>
            </div>
        </section>
    );
};

interface PropFirmsDisplayProps {
    firms: FirmData[];
    onFirmClick: (firm: FirmData) => void;
    allPlatforms: string[];
    allCountries: string[];
    currentFilters: AdvancedFiltersState;
    onFilterChange: (newFilters: Partial<AdvancedFiltersState>) => void;
    onResetFilters: () => void;
    firmsToCompare: number[];
    onToggleCompare: (firmId: number) => void;
    favoriteFirmIds: number[];
    onToggleFavorite: (firmId: number) => void;
    showFavoritesOnly: boolean;
    onToggleShowFavoritesOnly: () => void;
}
type SortableKeys = 'name' | 'rating' | 'maxAllocation' | 'country' | 'yearsInOp' | 'minDeposit';
type SortDirection = 'ascending' | 'descending';
interface SortConfig {
    key: SortableKeys;
    direction: SortDirection;
}
const PropFirmsDisplay: React.FC<PropFirmsDisplayProps> = ({
    firms,
    onFirmClick,
    allPlatforms,
    allCountries,
    currentFilters,
    onFilterChange,
    onResetFilters,
    firmsToCompare,
    onToggleCompare,
    favoriteFirmIds,
    onToggleFavorite,
    showFavoritesOnly,
    onToggleShowFavoritesOnly
}) => {
    const [sortConfig, setSortConfig] = React.useState<SortConfig | null>({ key: 'rating', direction: 'descending' });
    const [isFilterPanelOpen, setIsFilterPanelOpen] = React.useState(false);

    const requestSort = (key: SortableKeys) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortableKeys) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <span aria-hidden="true">▲</span> : <span aria-hidden="true">▼</span>;
    };

    const sortedFirms = React.useMemo(() => {
        let sortableItems = [...firms];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'ascending' ?
                           aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [firms, sortConfig]);

    const renderSortControl = (label: string, key: SortableKeys) => (
        <button
            className={`sort-control ${sortConfig?.key === key ? 'active' : ''}`}
            onClick={() => requestSort(key)}
            aria-label={`Sort by ${label} ${sortConfig?.key === key ? (sortConfig.direction === 'ascending' ? 'ascending' : 'descending') : ''}`}
        >
            {label} {getSortIndicator(key)}
        </button>
    );

    const toggleFilterPanel = () => setIsFilterPanelOpen(!isFilterPanelOpen);

    React.useEffect(() => {
        if (isFilterPanelOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isFilterPanelOpen]);


    return (
        <section className="prop-firms-display-container">
            <div className="container">
                <div className="controls-bar">
                     <button
                        className="btn btn-secondary filter-toggle-btn"
                        onClick={toggleFilterPanel}
                        aria-expanded={isFilterPanelOpen}
                        aria-controls="filter-panel"
                    >
                        <FilterIcon /> Filters
                    </button>
                    <div className="sort-controls">
                        {renderSortControl('Firm', 'name')}
                        {renderSortControl('Rating', 'rating')}
                        {renderSortControl('Max Allocation', 'maxAllocation')}
                        {renderSortControl('Entry Cost', 'minDeposit')}
                        {renderSortControl('Years', 'yearsInOp')}
                    </div>
                    <div className="favorites-toggle-container">
                        <label htmlFor="favorites-toggle" className="favorites-toggle-label">
                            Show Favorites Only
                        </label>
                        <button
                            id="favorites-toggle"
                            role="switch"
                            aria-checked={showFavoritesOnly}
                            onClick={onToggleShowFavoritesOnly}
                            className={`btn favorites-toggle-btn ${showFavoritesOnly ? 'active' : ''}`}
                        >
                            <FavoriteToggleIcon isFavorite={showFavoritesOnly} size="1em" />
                            <span>{showFavoritesOnly ? 'On' : 'Off'}</span>
                        </button>
                    </div>
                </div>

                {isFilterPanelOpen && (
                    <FilterPanel
                        allPlatforms={allPlatforms}
                        allCountries={allCountries}
                        currentFilters={currentFilters}
                        onFilterChange={onFilterChange}
                        onResetFilters={onResetFilters}
                        onClose={toggleFilterPanel}
                        showFavoritesOnly={showFavoritesOnly}
                        firmsData={firms}
                    />
                )}

                {sortedFirms.length > 0 ? (
                    <div className="prop-firm-grid">
                        {sortedFirms.map(firm => (
                            <PropFirmCard
                                key={firm.id}
                                firm={firm}
                                onViewDetails={() => onFirmClick(firm)}
                                isSelectedForCompare={firmsToCompare.includes(firm.id)}
                                onToggleCompare={(e: React.SyntheticEvent) => { e.stopPropagation(); onToggleCompare(firm.id);}}
                                compareDisabled={firmsToCompare.length >= MAX_FIRM_COMPARE_ITEMS && !firmsToCompare.includes(firm.id)}
                                isFavorite={favoriteFirmIds.includes(firm.id)}
                                onToggleFavorite={(e: React.MouseEvent) => { e.stopPropagation(); onToggleFavorite(firm.id);}}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="no-firms-message">No firms match your current criteria. Try adjusting your search or filters.</p>
                )}
            </div>
        </section>
    );
};

interface FilterPanelProps {
    allPlatforms: string[];
    allCountries: string[];
    currentFilters: AdvancedFiltersState;
    onFilterChange: (newFilters: Partial<AdvancedFiltersState>) => void;
    onResetFilters: () => void;
    onClose: () => void;
    showFavoritesOnly: boolean;
    firmsData: FirmData[];
}
const FilterPanel: React.FC<FilterPanelProps> = ({
    allPlatforms,
    allCountries,
    currentFilters,
    onFilterChange,
    onResetFilters,
    onClose,
    showFavoritesOnly,
    firmsData
}) => {
    const handlePlatformChange = (platform: string, checked: boolean) => {
        const newPlatforms = checked
            ? [...currentFilters.platforms, platform]
            : currentFilters.platforms.filter(p => p !== platform);
        onFilterChange({ platforms: newPlatforms });
    };

    const handleCountryChange = (country: string, checked: boolean) => {
        const newCountries = checked
            ? [...currentFilters.countries, country]
            : currentFilters.countries.filter(c => c !== country);
        onFilterChange({ countries: newCountries });
    };

    const handleAllocationChange = (rangeId: string) => {
        const selectedRange = allocationRanges.find(r => r.id === rangeId);
        if (selectedRange) {
            onFilterChange({ allocation: selectedRange.label === "Any Amount" ? null : selectedRange });
        }
    };

    const handleYearsChange = (rangeId: string) => {
        const selectedRange = yearsRanges.find(r => r.id === rangeId);
        if (selectedRange) {
            onFilterChange({ years: selectedRange.label === "Any Experience" ? null : selectedRange });
        }
    };

    const handleReset = () => {
        onResetFilters();
    };

    return (
        <div className="filter-panel-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="filter-panel-title">
            <div className="filter-panel" id="filter-panel" onClick={(e) => e.stopPropagation()}>
                <header className="filter-panel-header">
                    <h2 id="filter-panel-title">Filters</h2>
                    <button onClick={onClose} className="filter-panel-close-btn" aria-label="Close filter panel">&times;</button>
                </header>
                <div className={`filter-panel-body ${showFavoritesOnly ? 'disabled-filters' : ''}`}>
                    {showFavoritesOnly && (
                        <p className="favorites-notice">Advanced filters are disabled when "Show Favorites Only" is active.</p>
                    )}
                    <section className="filter-section" aria-labelledby="filter-platforms-label">
                        <h3 id="filter-platforms-label">Platforms</h3>
                        <div className="filter-options checkbox-group">
                            {allPlatforms.map(platform => (
                                <label key={platform} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={currentFilters.platforms.includes(platform)}
                                        onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                                        disabled={showFavoritesOnly}
                                    />
                                    {platform}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="filter-section" aria-labelledby="filter-allocation-label">
                        <h3 id="filter-allocation-label">Max Allocation</h3>
                        <div className="filter-options radio-group">
                            {allocationRanges.map(range => (
                                <label key={range.id} className="radio-label">
                                    <input
                                        type="radio"
                                        name="allocationFilter"
                                        value={range.id}
                                        checked={(currentFilters.allocation === null && range.label === "Any Amount") || currentFilters.allocation?.id === range.id}
                                        onChange={() => handleAllocationChange(range.id)}
                                        disabled={showFavoritesOnly}
                                    />
                                    {range.label}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="filter-section" aria-labelledby="filter-countries-label">
                        <h3 id="filter-countries-label">Country</h3>
                         <div className="filter-options checkbox-group">
                            {allCountries.map(country => (
                                <label key={country} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={currentFilters.countries.includes(country)}
                                        onChange={(e) => handleCountryChange(country, e.target.checked)}
                                        disabled={showFavoritesOnly}
                                    />
                                    {firmsData.find(f => f.country === country)?.countryFlag} {country}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="filter-section" aria-labelledby="filter-years-label">
                        <h3 id="filter-years-label">Years in Operation</h3>
                        <div className="filter-options radio-group">
                             {yearsRanges.map(range => (
                                <label key={range.id} className="radio-label">
                                    <input
                                        type="radio"
                                        name="yearsFilter"
                                        value={range.id}
                                        checked={(currentFilters.years === null && range.label === "Any Experience") || currentFilters.years?.id === range.id}
                                        onChange={() => handleYearsChange(range.id)}
                                        disabled={showFavoritesOnly}
                                    />
                                    {range.label}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section className="filter-section" aria-labelledby="filter-promos-label">
                        <h3 id="filter-promos-label" className="sr-only">Promotions</h3>
                        <div className="filter-options checkbox-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={currentFilters.promotionsOnly}
                                    onChange={(e) => onFilterChange({ promotionsOnly: e.target.checked })}
                                    disabled={showFavoritesOnly}
                                />
                                Show firms with promotions only
                            </label>
                        </div>
                    </section>
                </div>
                <footer className="filter-panel-footer">
                    <button onClick={handleReset} className="btn btn-secondary" disabled={showFavoritesOnly}>Reset Filters</button>
                    <button onClick={onClose} className="btn btn-primary">Done</button>
                </footer>
            </div>
        </div>
    );
};

interface PropFirmCardProps {
    firm: FirmData;
    onViewDetails: () => void;
    isSelectedForCompare: boolean;
    onToggleCompare: (event: React.SyntheticEvent) => void;
    compareDisabled: boolean;
    isFavorite: boolean;
    onToggleFavorite: (event: React.MouseEvent) => void;
}
const PropFirmCard: React.FC<PropFirmCardProps> = ({
    firm,
    onViewDetails,
    isSelectedForCompare,
    onToggleCompare,
    compareDisabled,
    isFavorite,
    onToggleFavorite
}) => {
    const [showAllAssets, setShowAllAssets] = React.useState(false);
    const [copiedCode, setCopiedCode] = React.useState<string | null>(null);
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setImageError(false);
    }, [firm.logoUrl]);

    const handleImageError = () => {
        setImageError(true);
    };

    const toggleShowAllAssets = () => setShowAllAssets(!showAllAssets);

    const copyPromoCode = (code: string | null) => {
        if (code && navigator.clipboard) {
            navigator.clipboard.writeText(code).then(() => {
                setCopiedCode(code);
                setTimeout(() => setCopiedCode(null), 2000);
            }).catch(err => console.error('Failed to copy: ', err));
        }
    };

    const displayedAssets = showAllAssets ? firm.assets : firm.assets.slice(0, 3);

    return (
        <article className="prop-firm-card" onClick={onViewDetails} onKeyDown={(e) => e.key === 'Enter' && onViewDetails()} tabIndex={0} role="button" aria-label={`View details for ${firm.name}`}>
            <header className="card-header">
                <div className="firm-logo">
                    {firm.logoUrl && !imageError ? (
                        <img
                            src={firm.logoUrl}
                            alt={`${firm.name} logo`}
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="logo-placeholder">{firm.name.substring(0,1)}</div>
                    )}
                </div>
                <div className="firm-identity">
                    <h3 className="firm-name">{firm.name}</h3>
                    <div className="firm-meta">
                        <span className="country-info">{firm.countryFlag} {firm.country}</span>
                        <span className="years-info">{firm.yearsInOp} yrs</span>
                    </div>
                </div>
                <div className="card-header-actions">
                    <button onClick={onToggleFavorite} className="favorite-toggle-btn" aria-pressed={isFavorite} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                        <FavoriteToggleIcon isFavorite={isFavorite} size="1.5em" />
                    </button>
                     <div className="firm-likes">
                        Likes: {firm.likes.toLocaleString()}
                    </div>
                </div>
            </header>

            <section className="card-body">
                <div className="card-section rating-section">
                    <span className="section-label">Rating</span>
                    <div className="rating-stars" role="img" aria-label={`Rating: ${firm.rating} out of 5 stars`}>
                        {'★'.repeat(Math.floor(firm.rating))}{'☆'.repeat(5 - Math.floor(firm.rating))}
                        <span className="rating-score">({firm.rating.toFixed(1)})</span>
                    </div>
                    <div className="review-count">{firm.reviews.toLocaleString()} reviews</div>
                </div>

                <div className="card-section allocation-section">
                    <span className="section-label">Max Allocation</span>
                    <span className="allocation-value">{formatAllocation(firm.maxAllocation)}</span>
                </div>

                 <div className="card-section entry-cost-section">
                    <span className="section-label">Min. Entry Cost</span>
                    <span className="entry-cost-value">${firm.minDeposit.toLocaleString()}</span>
                </div>

                <div className="card-section profit-split-section">
                    <span className="section-label">Profit Split</span>
                    <span className="profit-split-value">{firm.profitSplit}</span>
                </div>


                <div className="card-section assets-section">
                    <span className="section-label">Tradable Assets</span>
                    <div className="assets-list">
                        {displayedAssets.map(asset => <span key={asset} className="asset-tag">{asset}</span>)}
                        {!showAllAssets && firm.assets.length > 3 && (
                            <button onClick={(e) => { e.stopPropagation(); toggleShowAllAssets();}} className="asset-tag more-assets-btn" aria-expanded="false">
                                +{firm.assets.length - 3} more
                            </button>
                        )}
                        {showAllAssets && firm.assets.length > 3 && (
                             <button onClick={(e) => { e.stopPropagation(); toggleShowAllAssets();}} className="asset-tag more-assets-btn" aria-expanded="true">
                                Show less
                            </button>
                        )}
                    </div>
                </div>

                <div className="card-section platforms-section">
                    <span className="section-label">Platforms</span>
                    <div className="platforms-list">
                        {firm.platforms.map(platform => <PlatformDisplay key={platform.name} platform={platform} />)}
                    </div>
                </div>
            </section>

            <footer className="card-footer">
                <div className="card-footer-left">
                    {firm.promo && (
                        <div className="promo-info">
                            <span className="promo-tag">{firm.promo.text}</span>
                            {firm.promo.code && (
                                <div className="promo-code-area">
                                    Code: <strong className="code-text">{firm.promo.code}</strong>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyPromoCode(firm.promo!.code);}}
                                        className="copy-code-btn"
                                        aria-label={`Copy promo code ${firm.promo.code}`}
                                    >
                                        {copiedCode === firm.promo.code ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                     <label className="compare-checkbox-label" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={isSelectedForCompare}
                            onChange={onToggleCompare}
                            disabled={compareDisabled}
                            aria-label={isSelectedForCompare ? `Remove ${firm.name} from comparison` : `Add ${firm.name} to comparison`}
                        />
                        Compare Firms
                    </label>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onViewDetails(); }} className="btn btn-primary view-details-btn">View Details</button>
            </footer>
        </article>
    );
};

interface FirmDetailModalProps {
    firm: FirmData;
    onClose: () => void;
    isFavorite: boolean;
    onToggleFavorite: (event: React.MouseEvent) => void;
    programsToCompare: ProgramToCompare[];
    onToggleProgramCompare: (firmId: number, programId: string) => void;
}
const FirmDetailModal: React.FC<FirmDetailModalProps> = ({ firm, onClose, isFavorite, onToggleFavorite, programsToCompare, onToggleProgramCompare }) => {
    const [imageError, setImageError] = React.useState(false);

    React.useEffect(() => {
        setImageError(false);
    }, [firm.logoUrl]);

    const handleImageError = () => {
        setImageError(true);
    };

    React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const isProgramSelected = (programId: string) => {
        return programsToCompare.some(p => p.firmId === firm.id && p.programId === programId);
    };

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2 id="modal-title" className="modal-firm-name">{firm.name}</h2>
                    <div className="modal-header-actions">
                        <button onClick={onToggleFavorite} className="favorite-toggle-btn" aria-pressed={isFavorite} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                            <FavoriteToggleIcon isFavorite={isFavorite} size="1.5em" />
                        </button>
                        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">&times;</button>
                    </div>
                </header>
                <section className="modal-body">
                    <div className="modal-logo-container">
                       {firm.logoUrl && !imageError ? (
                           <img
                                src={firm.logoUrl}
                                alt={`${firm.name} logo`}
                                className="modal-firm-logo"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="logo-placeholder modal-logo-placeholder">{firm.name.substring(0,1)}</div>
                        )}
                    </div>
                    <p className="modal-firm-description">{firm.description}</p>
                    <div className="modal-details-grid">
                        <div className="detail-item"><strong>Country:</strong> {firm.countryFlag} {firm.country}</div>
                        <div className="detail-item"><strong>Years in Operation:</strong> {firm.yearsInOp}</div>
                        <div className="detail-item"><strong>Rating:</strong> {firm.rating}/5 ({firm.reviews} reviews)</div>
                        <div className="detail-item"><strong>Max Allocation:</strong> {formatAllocation(firm.maxAllocation)}</div>
                        <div className="detail-item"><strong>Min. Entry Cost:</strong> ${firm.minDeposit.toLocaleString()}</div>
                        <div className="detail-item"><strong>Profit Split:</strong> {firm.profitSplit}</div>
                    </div>
                    <div className="modal-section">
                        <strong>Assets:</strong>
                        <div className="assets-list modal-assets-list">
                            {firm.assets.map(asset => <span key={asset} className="asset-tag">{asset}</span>)}
                        </div>
                    </div>
                     <div className="modal-section">
                        <strong>Platforms:</strong>
                        <div className="platforms-list modal-platforms-list">
                            {firm.platforms.map(platform => <PlatformDisplay key={platform.name} platform={platform} />)}
                        </div>
                    </div>
                    {firm.promo && (
                        <div className="modal-section promo-section">
                            <strong>Promotion/Feature:</strong>
                            <div className="promo-details">
                                <span className="promo-tag">{firm.promo.text}</span>
                                {firm.promo.code && <span>Code: <strong>{firm.promo.code}</strong></span>}
                            </div>
                        </div>
                    )}
                    {firm.evaluationPrograms && firm.evaluationPrograms.length > 0 && (
                        <div className="modal-section evaluation-programs-section">
                            <strong>Evaluation Programs:</strong>
                            <ul className="evaluation-program-list">
                                {firm.evaluationPrograms.map(program => {
                                    const selected = isProgramSelected(program.programId!);
                                    const limitReached = programsToCompare.length >= MAX_PROGRAM_COMPARE_ITEMS && !selected;
                                    return (
                                        <li key={program.id} className="evaluation-program-item">
                                            <span>{program.name}</span>
                                            <button
                                                className={`btn btn-secondary btn-small ${selected ? 'selected' : ''}`}
                                                onClick={() => onToggleProgramCompare(firm.id, program.programId!)}
                                                disabled={limitReached}
                                                aria-label={selected ? `Remove ${program.name} from comparison` : `Add ${program.name} to comparison. ${limitReached ? 'Comparison limit reached.' : ''}`}
                                            >
                                                {selected ? 'Added' : (limitReached ? 'Limit' : 'Compare')}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {programsToCompare.length >= MAX_PROGRAM_COMPARE_ITEMS && <small className="compare-limit-notice">Maximum {MAX_PROGRAM_COMPARE_ITEMS} programs can be selected for comparison.</small>}
                        </div>
                    )}
                </section>
                <footer className="modal-footer">
                    <button onClick={onClose} className="btn btn-secondary">Close</button>
                    <a href="#" className="btn btn-primary" target="_blank" rel="noopener noreferrer">Visit Website</a>
                </footer>
            </div>
        </div>
    );
};

interface ComparisonTrayProps {
    selectedFirms: FirmData[];
    onRemove: (firmId: number) => void;
    onClear: () => void;
    onCompare: () => void;
}
const ComparisonTray: React.FC<ComparisonTrayProps> = ({ selectedFirms, onRemove, onClear, onCompare }) => {
    if (selectedFirms.length === 0) return null;

    return (
        <div className="comparison-tray" role="toolbar" aria-label="Firm comparison controls">
            <div className="comparison-tray-items">
                {selectedFirms.map(firm => (
                    <div key={firm.id} className="comparison-tray-item">
                        {firm.logoUrl ?
                            <img src={firm.logoUrl} alt={`${firm.name} logo`} className="comparison-tray-item-logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            : <span className="comparison-tray-item-logo-placeholder">{firm.name.substring(0,1)}</span>
                        }
                        <span className="comparison-tray-item-name">{firm.name.length > 15 ? `${firm.name.substring(0,12)}...` : firm.name}</span>
                        <button onClick={() => onRemove(firm.id)} className="comparison-tray-item-remove" aria-label={`Remove ${firm.name} from comparison`}>&times;</button>
                    </div>
                ))}
            </div>
            <div className="comparison-tray-actions">
                <button onClick={onCompare} className="btn btn-primary" disabled={selectedFirms.length < 2}>
                   <ScaleIcon /> Compare Firms ({selectedFirms.length})
                </button>
                <button onClick={onClear} className="btn btn-secondary">Clear All</button>
            </div>
        </div>
    );
};

interface ComparisonModalProps {
    firms: FirmData[];
    onClose: () => void;
}
const ComparisonModal: React.FC<ComparisonModalProps> = ({ firms, onClose }) => {
     React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const attributes: Array<{ label: string; render: (firm: FirmData) => React.ReactNode }> = [
        { label: "Rating", render: firm => (<><div className="rating-stars" role="img" aria-label={`Rating: ${firm.rating} out of 5 stars`}> {'★'.repeat(Math.floor(firm.rating))}{'☆'.repeat(5 - Math.floor(firm.rating))} <span className="rating-score">({firm.rating.toFixed(1)})</span> </div> <div className="review-count">{firm.reviews.toLocaleString()} reviews</div></>) },
        { label: "Max Allocation", render: firm => formatAllocation(firm.maxAllocation) },
        { label: "Profit Split", render: firm => firm.profitSplit },
        { label: "Min. Entry Cost", render: firm => `$${firm.minDeposit.toLocaleString()}` },
        { label: "Platforms", render: firm => <div className="platforms-list modal-platforms-list">{firm.platforms.map(platform => <PlatformDisplay key={platform.name} platform={platform} small />)}</div> },
        { label: "Country", render: firm => <>{firm.countryFlag} {firm.country}</> },
        { label: "Years in Operation", render: firm => `${firm.yearsInOp} yrs` },
        { label: "Promo", render: firm => firm.promo ? <span className="promo-tag">{firm.promo.text}{firm.promo.code ? <><br/>Code: <strong>{firm.promo.code}</strong></> : ''}</span> : 'N/A' },
        { label: "Evaluation Programs", render: firm => firm.evaluationPrograms && firm.evaluationPrograms.length > 0 ? `${firm.evaluationPrograms.length} Program(s)` : 'None Listed' },
    ];

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="comparison-modal-title">
            <div className="modal-content comparison-modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2 id="comparison-modal-title">Compare Firms ({firms.length})</h2>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">&times;</button>
                </header>
                <section className="modal-body">
                    <div className="comparison-table-container">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th className="feature-col">Feature</th>
                                    {firms.map(firm => (
                                        <th key={firm.id} className="firm-col">
                                            <div className="comparison-firm-header">
                                                {firm.logoUrl ?
                                                    <img src={firm.logoUrl} alt={`${firm.name} logo`} className="comparison-firm-logo" onError={(e) => {
                                                        const target = e.currentTarget as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const placeholder = target.nextElementSibling as HTMLElement;
                                                        if (placeholder && placeholder.classList.contains('logo-placeholder')) {
                                                             placeholder.style.display = 'flex';
                                                        }
                                                    }} />
                                                    : null
                                                }
                                                {(!firm.logoUrl) &&
                                                    <span className="logo-placeholder small" style={{display: firm.logoUrl? 'none': 'flex'}}>{firm.name.substring(0,1)}</span>
                                                }
                                                <span>{firm.name}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {attributes.map(attr => (
                                    <tr key={attr.label}>
                                        <td>{attr.label}</td>
                                        {firms.map(firm => (
                                            <td key={`${firm.id}-${attr.label}`}>{attr.render(firm)}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <footer className="modal-footer">
                    <button onClick={onClose} className="btn btn-primary">Close</button>
                </footer>
            </div>
        </div>
    );
};

const PropFirmEvaluationDetailsSection: React.FC<{ firms: FirmData[] }> = ({ firms }) => {
    const firmsWithPrograms = firms.filter(firm => firm.evaluationPrograms && firm.evaluationPrograms.length > 0);

    if (firmsWithPrograms.length === 0) {
        return (
            <section className="prop-firm-evaluation-details-section">
                <div className="container">
                    <p>No detailed evaluation programs available for comparison.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="prop-firm-evaluation-details-section">
            <div className="container">
                <h2>Detailed Funding Program Comparison</h2>
                {firmsWithPrograms.map(firm => (
                    <div key={firm.id} className="firm-evaluation-block">
                        <header className="firm-evaluation-header">
                            {firm.logoUrl ? (
                                <img src={firm.logoUrl} alt={`${firm.name} logo`} className="firm-evaluation-logo"
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = 'none';
                                    const placeholder = target.nextSibling as HTMLElement;
                                    if (placeholder && placeholder.classList.contains('firm-evaluation-logo-placeholder')) {
                                        placeholder.style.display = 'flex';
                                    }
                                }}
                                />
                            ) : null}
                            {(!firm.logoUrl) &&
                                <div className="firm-evaluation-logo-placeholder" style={{display: firm.logoUrl ? 'none': 'flex'}}>{firm.name.substring(0,1)}</div>
                            }
                            <h3>{firm.name}</h3>
                        </header>
                        <div className="evaluation-details-table-container">
                            <table className="evaluation-details-table">
                                <thead>
                                    <tr>
                                        <th className="characteristic-col">Characteristic</th>
                                        {firm.evaluationPrograms!.map(program => (
                                            <th key={program.id}>{program.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {characteristicsMap.map(char => (
                                        <tr key={char.key}>
                                            <td>{char.label}</td>
                                            {firm.evaluationPrograms!.map(program => (
                                                <td key={`${program.id}-${char.key}`} data-label={program.name}>
                                                    {program[char.key] || 'N/A'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

interface ProgramComparisonTrayProps {
    selectedPrograms: DetailedProgramToCompare[];
    onRemove: (firmId: number, programId: string) => void;
    onClear: () => void;
    onCompare: () => void;
}
const ProgramComparisonTray: React.FC<ProgramComparisonTrayProps> = ({ selectedPrograms, onRemove, onClear, onCompare }) => {
    if (selectedPrograms.length === 0) return null;

    return (
        <div className="comparison-tray program-comparison-tray" role="toolbar" aria-label="Program comparison controls">
            <div className="comparison-tray-items">
                {selectedPrograms.map(prog => (
                    <div key={`${prog.firmId}-${prog.id}`} className="comparison-tray-item">
                        {prog.firmLogoUrl ?
                            <img src={prog.firmLogoUrl} alt={`${prog.firmName} logo`} className="comparison-tray-item-logo" onError={(e) => (e.currentTarget.style.display = 'none')} />
                            : <span className="comparison-tray-item-logo-placeholder">{prog.firmName.substring(0,1)}</span>
                        }
                        <span className="comparison-tray-item-name" title={`${prog.firmName} - ${prog.name}`}>
                           {prog.firmName.substring(0,6)}.. - {prog.name.length > 10 ? `${prog.name.substring(0,7)}...` : prog.name}
                        </span>
                        <button onClick={() => onRemove(prog.firmId, prog.programId!)} className="comparison-tray-item-remove" aria-label={`Remove ${prog.firmName} ${prog.name} from comparison`}>&times;</button>
                    </div>
                ))}
            </div>
            <div className="comparison-tray-actions">
                <button onClick={onCompare} className="btn btn-primary" disabled={selectedPrograms.length < 2}>
                   <ScaleIcon /> Compare Programs ({selectedPrograms.length})
                </button>
                <button onClick={onClear} className="btn btn-secondary">Clear All</button>
            </div>
        </div>
    );
};

interface ProgramComparisonModalProps {
    programs: DetailedProgramToCompare[];
    onClose: () => void;
}
const ProgramComparisonModal: React.FC<ProgramComparisonModalProps> = ({ programs, onClose }) => {
    React.useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="program-comparison-modal-title">
            <div className="modal-content comparison-modal-content program-comparison-modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2 id="program-comparison-modal-title">Compare Evaluation Programs ({programs.length})</h2>
                    <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">&times;</button>
                </header>
                <section className="modal-body">
                    <div className="comparison-table-container">
                        <table className="comparison-table program-comparison-table">
                            <thead>
                                <tr>
                                    <th className="feature-col">Characteristic</th>
                                    {programs.map(prog => (
                                        <th key={`${prog.firmId}-${prog.id}`} className="firm-col program-col">
                                            <div className="comparison-firm-header">
                                                 {prog.firmLogoUrl ?
                                                    <img src={prog.firmLogoUrl} alt={`${prog.firmName} logo`} className="comparison-firm-logo small-logo" onError={(e) => {
                                                        const target = e.currentTarget as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        const placeholder = target.nextElementSibling as HTMLElement;
                                                        if (placeholder && placeholder.classList.contains('logo-placeholder')) {
                                                             placeholder.style.display = 'flex';
                                                        }
                                                    }} />
                                                     : null }
                                                {(!prog.firmLogoUrl) &&
                                                    <span className="logo-placeholder small" style={{display: prog.firmLogoUrl ? 'none': 'flex'}}>{prog.firmName.substring(0,1)}</span>
                                                }
                                                <span className="program-comparison-firm-name">{prog.firmName}</span>
                                                <span className="program-comparison-program-name">{prog.name}</span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {characteristicsMap.map(char => (
                                    <tr key={char.key}>
                                        <td>{char.label}</td>
                                        {programs.map(prog => (
                                            <td key={`${prog.firmId}-${prog.id}-${char.key}`}>
                                                {prog[char.key] || 'N/A'}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
                <footer className="modal-footer">
                    <button onClick={onClose} className="btn btn-primary">Close</button>
                </footer>
            </div>
        </div>
    );
};


const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} FuturesFlow. All rights reserved.</p>
                <nav className="footer-nav" aria-label="Footer navigation">
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Service</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

const DrawdownVisualizerPage: React.FC = () => {
    return (
        <main>
            <DrawdownVisualizer />
        </main>
    );
};

interface HomePageProps {
    activeMarket: 'CFD' | 'Futures';
}
const HomePage: React.FC<HomePageProps> = ({ activeMarket }) => {
    const [firms, setFirms] = React.useState<FirmData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedFirm, setSelectedFirm] = React.useState<FirmData | null>(null);
    const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFiltersState>(initialAdvancedFilters);
    const [firmsToCompare, setFirmsToCompare] = React.useState<number[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = React.useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
    const [favoriteFirmIds, setFavoriteFirmIds] = React.useState<number[]>(() => {
        const storedFavorites = localStorage.getItem('favoriteFirms');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });
    
    const [programsToCompare, setProgramsToCompare] = React.useState<ProgramToCompare[]>([]);
    const [isProgramCompareModalOpen, setIsProgramCompareModalOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchFirms = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3001/api/firms`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setFirms(data);
            } catch (error) {
                console.error("Error al obtener los datos de las firmas:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFirms();
    }, []);

    React.useEffect(() => {
        localStorage.setItem('favoriteFirms', JSON.stringify(favoriteFirmIds));
    }, [favoriteFirmIds]);

    const toggleFavoriteFirm = (firmId: number) => {
        setFavoriteFirmIds(prev => prev.includes(firmId) ? prev.filter(id => id !== firmId) : [...prev, firmId]);
    };

    const allPlatforms = React.useMemo(() => Array.from(new Set(firms.flatMap(f => f.platforms.map(p => p.name)))).sort(), [firms]);
    const allCountries = React.useMemo(() => Array.from(new Set(firms.map(f => f.country))).sort(), [firms]);

    const filteredFirms = React.useMemo(() => {
        let firmsToFilter = firms.filter(firm => firm.marketType === activeMarket);
        if (showFavoritesOnly) {
            firmsToFilter = firmsToFilter.filter(firm => favoriteFirmIds.includes(firm.id));
        } else { 
             firmsToFilter = firmsToFilter.filter(firm => {
                if (advancedFilters.platforms.length === 0) return true;
                return advancedFilters.platforms.some(pFilter => firm.platforms.some(fp => fp.name === pFilter));
            }).filter(firm => {
                if (!advancedFilters.allocation || advancedFilters.allocation.label === "Any Amount") return true;
                return firm.maxAllocation >= advancedFilters.allocation.min && firm.maxAllocation <= advancedFilters.allocation.max;
            }).filter(firm => {
                if (advancedFilters.countries.length === 0) return true;
                return advancedFilters.countries.includes(firm.country);
            }).filter(firm => {
                if (!advancedFilters.years || advancedFilters.years.label === "Any Experience") return true;
                return firm.yearsInOp >= advancedFilters.years.min && firm.yearsInOp <= advancedFilters.years.max;
            }).filter(firm => {
                if (!advancedFilters.promotionsOnly) return true;
                return !!firm.promo;
            });
        }
        return firmsToFilter;
    }, [firms, activeMarket, advancedFilters, favoriteFirmIds, showFavoritesOnly]);
    
    const openModal = (firm: FirmData) => setSelectedFirm(firm);
    const closeModal = () => setSelectedFirm(null);
    const handleAdvancedFilterChange = (newFilters: Partial<AdvancedFiltersState>) => setAdvancedFilters(prev => ({ ...prev, ...newFilters }));
    const resetAdvancedFilters = () => setAdvancedFilters(initialAdvancedFilters);
    
    const toggleCompareFirm = (firmId: number) => { setFirmsToCompare(prev => { if (prev.includes(firmId)) return prev.filter(id => id !== firmId); if (prev.length < MAX_FIRM_COMPARE_ITEMS) return [...prev, firmId]; return prev; }); };
    const removeFirmFromCompare = (firmId: number) => setFirmsToCompare(prev => prev.filter(id => id !== firmId));
    const clearCompareSelection = () => setFirmsToCompare([]);
    const openCompareModal = () => firmsToCompare.length >= 2 && setIsCompareModalOpen(true);
    const closeCompareModal = () => setIsCompareModalOpen(false);
    
    const comparisonFirmsData = React.useMemo(() => 
        firmsToCompare.map(id => firms.find(firm => firm.id === id)).filter(Boolean) as FirmData[], 
    [firmsToCompare, firms]);

    const toggleProgramCompare = (firmId: number, programId: string) => { setProgramsToCompare(prev => { const existingIndex = prev.findIndex(p => p.firmId === firmId && p.programId === programId); if (existingIndex > -1) return prev.filter((_, index) => index !== existingIndex); if (prev.length < MAX_PROGRAM_COMPARE_ITEMS) return [...prev, { firmId, programId }]; return prev; }); };
    const removeProgramFromCompare = (firmId: number, programId: string) => { setProgramsToCompare(prev => prev.filter(p => !(p.firmId === firmId && p.programId === programId))); };
    const clearProgramCompareSelection = () => setProgramsToCompare([]);
    const openProgramCompareModal = () => programsToCompare.length >= 2 && setIsProgramCompareModalOpen(true);
    const closeProgramCompareModal = () => setIsProgramCompareModalOpen(false);

    const detailedProgramsToCompareData = React.useMemo(() => {
        return programsToCompare.map(pc => {
            const firm = firms.find(f => f.id === pc.firmId);
            if (!firm || !firm.evaluationPrograms) return null;
            const program = firm.evaluationPrograms.find(p => p.programId === pc.programId);
            if (!program) return null;
            return { ...program, firmId: firm.id, firmName: firm.name, firmLogoUrl: firm.logoUrl };
        }).filter(Boolean) as DetailedProgramToCompare[];
    }, [programsToCompare, firms]);

    if (isLoading) {
        return <main><div className="container" style={{ textAlign: 'center', padding: '50px' }}><h1>Cargando firmas...</h1></div></main>;
    }

    return (
        <main>
            <SimplifiedHeroSection />
            <PropFirmsDisplay firms={filteredFirms} onFirmClick={openModal} allPlatforms={allPlatforms} allCountries={allCountries} currentFilters={advancedFilters} onFilterChange={handleAdvancedFilterChange} onResetFilters={resetAdvancedFilters} firmsToCompare={firmsToCompare} onToggleCompare={toggleCompareFirm} favoriteFirmIds={favoriteFirmIds} onToggleFavorite={toggleFavoriteFirm} showFavoritesOnly={showFavoritesOnly} onToggleShowFavoritesOnly={() => setShowFavoritesOnly(prev => !prev)} />
            <PropFirmEvaluationDetailsSection firms={firms.filter(f => f.marketType === activeMarket)} />
            
            {selectedFirm && (
                <FirmDetailModal firm={selectedFirm} onClose={closeModal} isFavorite={favoriteFirmIds.includes(selectedFirm.id)} onToggleFavorite={(e) => { e.stopPropagation(); toggleFavoriteFirm(selectedFirm.id); }} programsToCompare={programsToCompare} onToggleProgramCompare={toggleProgramCompare} />
            )}
            {firmsToCompare.length > 0 && (
                <ComparisonTray selectedFirms={comparisonFirmsData} onRemove={removeFirmFromCompare} onClear={clearCompareSelection} onCompare={openCompareModal}/>
            )}
            {isCompareModalOpen && (
                <ComparisonModal firms={comparisonFirmsData} onClose={closeCompareModal} />
            )}
            {detailedProgramsToCompareData.length > 0 && (
                <ProgramComparisonTray selectedPrograms={detailedProgramsToCompareData} onRemove={removeProgramFromCompare} onClear={clearProgramCompareSelection} onCompare={openProgramCompareModal} />
            )}
            {isProgramCompareModalOpen && (
                <ProgramComparisonModal programs={detailedProgramsToCompareData} onClose={closeProgramCompareModal} />
            )}
        </main>
    );
};

interface AppLayoutProps {}
const AppLayout: React.FC<AppLayoutProps> = () => {
    const [theme, setTheme] = React.useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
    const [activeMarket, setActiveMarket] = React.useState<'CFD' | 'Futures'>('Futures');

    React.useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

    return (
        <div className="app-container">
            <Header activeMarket={activeMarket} onMarketChange={setActiveMarket} theme={theme} onToggleTheme={toggleTheme} />
            <Routes>
                <Route path="/" element={<HomePage activeMarket={activeMarket} />} />
                <Route path="/drawdown-visualizer" element={<DrawdownVisualizerPage />} />
            </Routes>
            <Footer />
        </div>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <AppLayout />
            </BrowserRouter>
        </React.StrictMode>
    );
}
