import React from 'react';
import type { FirmData } from '../../types'; // Adjusted path
import { formatAllocation } from '../../utils/formatters'; // Adjusted path
import { FavoriteToggleIcon } from './Icons'; // Adjusted path
import { PlatformDisplay } from './PlatformDisplay'; // Adjusted path

export interface PropFirmCardProps {
    firm: FirmData;
    onViewDetails: () => void;
    isSelectedForCompare: boolean;
    onToggleCompare: (event: React.SyntheticEvent) => void;
    compareDisabled: boolean;
    isFavorite: boolean;
    onToggleFavorite: (event: React.MouseEvent) => void;
}

export const PropFirmCard: React.FC<PropFirmCardProps> = ({
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
