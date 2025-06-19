import React from 'react';
import type { FirmData, ProgramToCompare } from '../../types'; // Adjusted path
import { FavoriteToggleIcon } from './Icons'; // Adjusted path
import { PlatformDisplay } from './PlatformDisplay'; // Adjusted path
import { MAX_PROGRAM_COMPARE_ITEMS } from '../../utils/constants'; // Adjusted path
import { formatAllocation } from '../../utils/formatters'; // Adjusted path

export interface FirmDetailModalProps {
    firm: FirmData;
    onClose: () => void;
    isFavorite: boolean;
    onToggleFavorite: (event: React.MouseEvent) => void;
    programsToCompare: ProgramToCompare[];
    onToggleProgramCompare: (firmId: number, programId: string) => void;
}

export const FirmDetailModal: React.FC<FirmDetailModalProps> = ({
    firm,
    onClose,
    isFavorite,
    onToggleFavorite,
    programsToCompare,
    onToggleProgramCompare
}) => {
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
                                    const selected = isProgramSelected(program.programId!); // Added non-null assertion
                                    const limitReached = programsToCompare.length >= MAX_PROGRAM_COMPARE_ITEMS && !selected;
                                    return (
                                        <li key={program.id} className="evaluation-program-item">
                                            <span>{program.name}</span>
                                            <button
                                                className={`btn btn-secondary btn-small ${selected ? 'selected' : ''}`}
                                                onClick={() => onToggleProgramCompare(firm.id, program.programId!)} // Added non-null assertion
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
                    <a href="#" className="btn btn-primary" target="_blank" rel="noopener noreferrer">Visit Website</a> {/* Assuming a placeholder href leads to the firm's actual website eventually */}
                </footer>
            </div>
        </div>
    );
};
