import React from 'react';
import type { FirmData } from '../../types'; // Adjusted path
import { ScaleIcon } from './Icons'; // Adjusted path

export interface ComparisonTrayProps {
    selectedFirms: FirmData[];
    onRemove: (firmId: number) => void;
    onClear: () => void;
    onCompare: () => void;
}

export const ComparisonTray: React.FC<ComparisonTrayProps> = ({ selectedFirms, onRemove, onClear, onCompare }) => {
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
