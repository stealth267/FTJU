import React from 'react';
import type { FirmData, AdvancedFiltersState, SortableKeys, SortDirection, SortConfig } from '../../types'; // Adjusted path
import { FilterIcon, FavoriteToggleIcon } from './Icons'; // Adjusted path
import { FilterPanel, FilterPanelProps } from './FilterPanel'; // Adjusted path
import { PropFirmCard, PropFirmCardProps } from './Card'; // Adjusted path, Card.tsx exports PropFirmCard

// Props for PropFirmsDisplay
export interface PropFirmsDisplayProps {
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

// PropFirmsDisplay Component
export const PropFirmsDisplay: React.FC<PropFirmsDisplayProps> = ({
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

    // MAX_FIRM_COMPARE_ITEMS is used by PropFirmCard, not directly here.
    // It was a global constant. PropFirmCard will get it via its props or context if needed,
    // or if it was truly global, it would be imported directly in PropFirmCard.
    // Checking original main.tsx: MAX_FIRM_COMPARE_ITEMS was used in HomePage to disable compare toggle in PropFirmsDisplay
    // This means PropFirmsDisplay needs to pass down 'compareDisabled' to PropFirmCard correctly.
    // The 'compareDisabled' logic is already in PropFirmCard's props.
    // HomePage will calculate 'compareDisabled' and pass it to PropFirmsDisplay, which passes it to PropFirmCard.

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
                        showFavoritesOnly={showFavoritesOnly} // Pass down
                        firmsData={firms} // Pass down
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
                                // compareDisabled is now correctly passed from HomePage -> PropFirmsDisplay -> PropFirmCard
                                // PropFirmsDisplay doesn't calculate it itself. It receives firmsToCompare.
                                // The PropFirmCardProps interface has compareDisabled.
                                // So PropFirmsDisplay must ensure it's passed.
                                // The original main.tsx's HomePage calculated it.
                                // PropFirmsDisplay itself doesn't need MAX_FIRM_COMPARE_ITEMS.
                                // It just needs to correctly pass the compareDisabled prop if it receives it,
                                // or HomePage will pass it directly to PropFirmCard if PropFirmsDisplay doesn't handle it.
                                // Let's assume HomePage will pass the correct `compareDisabled` status when it uses PropFirmCard, possibly via PropFirmsDisplay.
                                // The original PropFirmsDisplay didn't have compareDisabled in its direct props.
                                // PropFirmCard received it from HomePage's map function.
                                // So, this PropFirmsDisplay does not need to manage compareDisabled itself.
                                // The PropFirmCardProps itself has compareDisabled, so the map below is fine.
                                compareDisabled={firmsToCompare.length >= 4 && !firmsToCompare.includes(firm.id)} // MAX_FIRM_COMPARE_ITEMS was 4
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
