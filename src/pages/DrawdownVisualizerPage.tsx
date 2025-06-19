import React from 'react';
import type { DrawdownType } from '../types'; // Adjusted path
import { formatCurrency } from '../utils/formatters'; // Adjusted path

// Original DrawdownVisualizer component (copied from previous view of main.tsx)
const DrawdownVisualizer: React.FC = () => {
    type DrawdownTypeLocal = DrawdownType; // Renaming to avoid conflict if DrawdownType is also a global var
    const [accountBalanceInput, setAccountBalanceInput] = React.useState<string>('50000');
    const [drawdownType, setDrawdownType] = React.useState<DrawdownTypeLocal>('trailing_intraday');
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

    const getDrawdownTypeExplanation = (type: DrawdownTypeLocal) => {
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
                            <select id="drawdownType" value={drawdownType} onChange={(e) => setDrawdownType(e.target.value as DrawdownTypeLocal)}>
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

// Original DrawdownVisualizerPage component (copied from previous view of main.tsx)
const DrawdownVisualizerPage: React.FC = () => {
    return (
        <main>
            <DrawdownVisualizer />
        </main>
    );
};

export default DrawdownVisualizerPage;
