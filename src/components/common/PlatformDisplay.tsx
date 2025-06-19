import React from 'react';
import type { Platform } from '@/types';
import { CTraderIcon, DXtradeIcon, MT4Icon, MT5Icon, TradingViewIcon, NinjaTraderIcon } from '@/components/common/Icons';

// Helper function (not exported)
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
};

export const PlatformDisplay: React.FC<{ platform: Platform; small?: boolean }> = ({ platform, small = false }) => {
    if (!platform || !platform.name) return null;

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
