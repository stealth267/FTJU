import React from 'react';
import type { DetailedProgramToCompare } from '../../types'; // Adjusted path
import { ScaleIcon } from './Icons'; // Adjusted path

export interface ProgramComparisonTrayProps {
    selectedPrograms: DetailedProgramToCompare[];
    onRemove: (firmId: number, programId: string) => void;
    onClear: () => void;
    onCompare: () => void;
}

export const ProgramComparisonTray: React.FC<ProgramComparisonTrayProps> = ({ selectedPrograms, onRemove, onClear, onCompare }) => {
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
