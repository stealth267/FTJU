import React from 'react';
import type { FirmData } from '../../types'; // Adjusted path
import { PlatformDisplay } from './PlatformDisplay'; // Adjusted path
import { formatAllocation } from '../../utils/formatters'; // Adjusted path

export interface ComparisonModalProps {
    firms: FirmData[];
    onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ firms, onClose }) => {
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
                                                {(!firm.logoUrl) && // Conditional placeholder rendering
                                                    <span className="logo-placeholder small" style={{display: 'flex'}}>{firm.name.substring(0,1)}</span>
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
