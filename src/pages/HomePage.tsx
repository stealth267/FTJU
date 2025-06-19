import React from 'react';
import type { FirmData, AdvancedFiltersState, ProgramToCompare, DetailedProgramToCompare } from '../types';
import { initialAdvancedFilters, MAX_FIRM_COMPARE_ITEMS, MAX_PROGRAM_COMPARE_ITEMS } from '../utils/constants'; // Import constants

import SimplifiedHeroSection from '../components/layout/SimplifiedHeroSection';
import { PropFirmsDisplay } from '../components/common/PropFirmsDisplay';
import { FirmDetailModal } from '../components/common/FirmDetailModal'; // Corrected path
import { ComparisonTray } from '../components/common/ComparisonTray'; // Corrected path
import { ComparisonModal } from '../components/common/ComparisonModal'; // Corrected path
import { ProgramComparisonTray } from '../components/common/ProgramComparisonTray'; // Corrected path
import { ProgramComparisonModal } from '../components/modals/ProgramComparisonModal'; // Assuming this will be created
// Note: The modal and tray components listed above are not yet extracted in separate files.
// This step assumes they will be, or this HomePage will be updated again later.
// For now, to make PropFirmsDisplay work, we only strictly need PropFirmsDisplay and its direct dependencies.
// However, the original HomePage logic included these, so I'm adding them to represent the full intended structure.

export interface HomePageProps {
  activeMarket: 'CFD' | 'Futures';
}

const HomePage: React.FC<HomePageProps> = ({ activeMarket }) => {
    const [firms, setFirms] = React.useState<FirmData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedFirm, setSelectedFirm] = React.useState<FirmData | null>(null);
    const [advancedFilters, setAdvancedFilters] = React.useState<AdvancedFiltersState>(initialAdvancedFilters);
    const [firmsToCompare, setFirmsToCompare] = React.useState<number[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = React.useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
    const [favoriteFirmIds, setFavoriteFirmIds] = React.useState<number[]>(() => {
        const storedFavorites = typeof window !== 'undefined' ? localStorage.getItem('favoriteFirms') : null;
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    });

    const [programsToCompare, setProgramsToCompare] = React.useState<ProgramToCompare[]>([]);
    const [isProgramCompareModalOpen, setIsProgramCompareModalOpen] = React.useState(false);

    React.useEffect(() => {
        const fetchFirms = async () => {
            setIsLoading(true);
            try {
                // This URL will need to be configurable or an environment variable in a real app
                const response = await fetch(`http://localhost:3001/api/firms`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setFirms(data);
            } catch (error) {
                console.error("Error fetching firm data:", error);
                // Potentially set an error state here to display to the user
            } finally {
                setIsLoading(false);
            }
        };
        fetchFirms();
    }, []);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('favoriteFirms', JSON.stringify(favoriteFirmIds));
        }
    }, [favoriteFirmIds]);

    const toggleFavoriteFirm = (firmId: number) => {
        setFavoriteFirmIds(prev => prev.includes(firmId) ? prev.filter(id => id !== firmId) : [...prev, firmId]);
    };

    const allPlatforms = React.useMemo(() => Array.from(new Set(firms.flatMap(f => f.platforms.map(p => p.name)))).sort(), [firms]);
    const allCountries = React.useMemo(() => Array.from(new Set(firms.map(f => f.country))).sort(), [firms]);

    const filteredFirms = React.useMemo(() => {
        let firmsToFilter = firms.filter(firm => firm.marketType === activeMarket);
        if (showFavoritesOnly) {
            firmsToFilter = firmsToFilter.filter(firm => favoriteFirmIds.includes(firm.id));
        } else {
             firmsToFilter = firmsToFilter.filter(firm => {
                if (advancedFilters.platforms.length === 0) return true;
                return advancedFilters.platforms.some(pFilter => firm.platforms.some(fp => fp.name === pFilter));
            }).filter(firm => {
                if (!advancedFilters.allocation || advancedFilters.allocation.label === "Any Amount") return true;
                return firm.maxAllocation >= advancedFilters.allocation.min && firm.maxAllocation <= advancedFilters.allocation.max;
            }).filter(firm => {
                if (advancedFilters.countries.length === 0) return true;
                return advancedFilters.countries.includes(firm.country);
            }).filter(firm => {
                if (!advancedFilters.years || advancedFilters.years.label === "Any Experience") return true;
                return firm.yearsInOp >= advancedFilters.years.min && firm.yearsInOp <= advancedFilters.years.max;
            }).filter(firm => {
                if (!advancedFilters.promotionsOnly) return true;
                return !!firm.promo;
            });
        }
        return firmsToFilter;
    }, [firms, activeMarket, advancedFilters, favoriteFirmIds, showFavoritesOnly]);

    const openModal = (firm: FirmData) => setSelectedFirm(firm);
    const closeModal = () => setSelectedFirm(null);
    const handleAdvancedFilterChange = (newFilters: Partial<AdvancedFiltersState>) => setAdvancedFilters(prev => ({ ...prev, ...newFilters }));
    const resetAdvancedFilters = () => setAdvancedFilters(initialAdvancedFilters);

    const toggleCompareFirm = (firmId: number) => { setFirmsToCompare(prev => { if (prev.includes(firmId)) return prev.filter(id => id !== firmId); if (prev.length < MAX_FIRM_COMPARE_ITEMS) return [...prev, firmId]; return prev; }); };
    const removeFirmFromCompare = (firmId: number) => setFirmsToCompare(prev => prev.filter(id => id !== firmId));
    const clearCompareSelection = () => setFirmsToCompare([]);
    const openCompareModal = () => firmsToCompare.length >= 2 && setIsCompareModalOpen(true);
    const closeCompareModal = () => setIsCompareModalOpen(false);

    const comparisonFirmsData = React.useMemo(() =>
        firmsToCompare.map(id => firms.find(firm => firm.id === id)).filter(Boolean) as FirmData[],
    [firmsToCompare, firms]);

    const toggleProgramCompare = (firmId: number, programId: string) => { setProgramsToCompare(prev => { const existingIndex = prev.findIndex(p => p.firmId === firmId && p.programId === programId); if (existingIndex > -1) return prev.filter((_, index) => index !== existingIndex); if (prev.length < MAX_PROGRAM_COMPARE_ITEMS) return [...prev, { firmId, programId }]; return prev; }); };
    const removeProgramFromCompare = (firmId: number, programId: string) => { setProgramsToCompare(prev => prev.filter(p => !(p.firmId === firmId && p.programId === programId))); };
    const clearProgramCompareSelection = () => setProgramsToCompare([]);
    const openProgramCompareModal = () => programsToCompare.length >= 2 && setIsProgramCompareModalOpen(true);
    const closeProgramCompareModal = () => setIsProgramCompareModalOpen(false);

    const detailedProgramsToCompareData = React.useMemo(() => {
        return programsToCompare.map(pc => {
            const firm = firms.find(f => f.id === pc.firmId);
            if (!firm || !firm.evaluationPrograms) return null;
            const program = firm.evaluationPrograms.find(p => p.programId === pc.programId);
            if (!program) return null;
            return { ...program, firmId: firm.id, firmName: firm.name, firmLogoUrl: firm.logoUrl };
        }).filter(Boolean) as DetailedProgramToCompare[];
    }, [programsToCompare, firms]);

    if (isLoading) {
        return <main><div className="container" style={{ textAlign: 'center', padding: '50px' }}><h1>Loading firms...</h1></div></main>;
    }

    return (
        <main>
            <SimplifiedHeroSection />
            <PropFirmsDisplay
                firms={filteredFirms}
                onFirmClick={openModal}
                allPlatforms={allPlatforms}
                allCountries={allCountries}
                currentFilters={advancedFilters}
                onFilterChange={handleAdvancedFilterChange}
                onResetFilters={resetAdvancedFilters}
                firmsToCompare={firmsToCompare}
                onToggleCompare={toggleCompareFirm}
                favoriteFirmIds={favoriteFirmIds}
                onToggleFavorite={toggleFavoriteFirm}
                showFavoritesOnly={showFavoritesOnly}
                onToggleShowFavoritesOnly={() => setShowFavoritesOnly(prev => !prev)}
            />
            {/* PropFirmEvaluationDetailsSection would also be part of this page, to be extracted later */}
            {/* <PropFirmEvaluationDetailsSection firms={firms.filter(f => f.marketType === activeMarket)} /> */}

            {selectedFirm && (
                <FirmDetailModal
                    firm={selectedFirm}
                    onClose={closeModal}
                    isFavorite={favoriteFirmIds.includes(selectedFirm.id)}
                    onToggleFavorite={(e: React.MouseEvent) => { e.stopPropagation(); toggleFavoriteFirm(selectedFirm.id);}}
                    programsToCompare={programsToCompare}
                    onToggleProgramCompare={toggleProgramCompare}
                />
            )}
            {firmsToCompare.length > 0 && (
                <ComparisonTray
                    selectedFirms={comparisonFirmsData}
                    onRemove={removeFirmFromCompare}
                    onClear={clearCompareSelection}
                    onCompare={openCompareModal}
                />
            )}
            {isCompareModalOpen && (
                <ComparisonModal
                    firms={comparisonFirmsData}
                    onClose={closeCompareModal}
                />
            )}
            {detailedProgramsToCompareData.length > 0 && (
                <ProgramComparisonTray
                    selectedPrograms={detailedProgramsToCompareData}
                    onRemove={removeProgramFromCompare}
                    onClear={clearProgramCompareSelection}
                    onCompare={openProgramCompareModal}
                />
            )}
            {isProgramCompareModalOpen && (
                <ProgramComparisonModal
                    programs={detailedProgramsToCompareData}
                    onClose={closeProgramCompareModal}
                />
            )}
        </main>
    );
};

export default HomePage;
