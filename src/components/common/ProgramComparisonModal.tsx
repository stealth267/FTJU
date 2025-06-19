import React from 'react';
import type { DetailedProgramToCompare } from '../../types'; // Adjusted path
import { characteristicsMap } from '../../utils/constants'; // Adjusted path

export interface ProgramComparisonModalProps {
    programs: DetailedProgramToCompare[];
    onClose: () => void;
}

export const ProgramComparisonModal: React.FC<ProgramComparisonModalProps> = ({ programs, onClose }) => {
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
                                                {(!prog.firmLogoUrl && // Conditional placeholder
                                                    <span className="logo-placeholder small" style={{display: 'flex'}}>{prog.firmName.substring(0,1)}</span>
                                                )}
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
                                                {/* @ts-ignore TODO: Fix type for char.key if necessary */}
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
