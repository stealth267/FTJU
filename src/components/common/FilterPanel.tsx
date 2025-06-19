import React from 'react';
import type { AdvancedFiltersState, FirmData } from '../../types'; // Adjusted path
import { allocationRanges, yearsRanges } from '../../utils/constants'; // Adjusted path
import { FilterIcon } from './Icons'; // Assuming FilterIcon is in Icons.tsx, adjust if it was missed

// Props for FilterPanel
export interface FilterPanelProps {
    allPlatforms: string[];
    allCountries: string[];
    currentFilters: AdvancedFiltersState;
    onFilterChange: (newFilters: Partial<AdvancedFiltersState>) => void;
    onResetFilters: () => void;
    onClose: () => void;
    showFavoritesOnly: boolean; // Added this prop based on usage in original main.tsx
    firmsData: FirmData[]; // Added this prop based on usage
}

// FilterPanel Component
export const FilterPanel: React.FC<FilterPanelProps> = ({
    allPlatforms,
    allCountries,
    currentFilters,
    onFilterChange,
    onResetFilters,
    onClose,
    showFavoritesOnly, // Added
    firmsData // Added
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
                                    {/* Ensure firmsData is available for countryFlag */}
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
