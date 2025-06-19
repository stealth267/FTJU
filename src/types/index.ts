export interface Platform {
    name: string;
    iconId?: string;
}

export interface Promo {
    text: string;
    code: string | null;
}

export interface EvaluationProgram {
    id: number;
    programId: string;
    name: string;
    price?: number | null;
    profitTarget?: string | null;
    maxTotalLoss?: string | null;
    drawdownType?: string | null;
    dailyLossLimit?: string | null;
    maxContracts?: string | null;
    consistencyRules?: string | null;
    minTradingDays?: string | null;
    keyRestrictions?: string | null;
    maxDrawdown?: string | null;
    maxPositions?: string | null;
    profitSplit?: string | null;
    scalingPlan?: string | null;
    resetFee?: string | null;
    oneTimeFee?: string | null;
    leverage?: string | null;
}

export interface FirmData {
    id: number;
    logoUrl: string;
    name: string;
    likes: number;
    rating: number;
    reviews: number;
    country: string;
    countryFlag: string;
    yearsInOp: number;
    assets: string[];
    platforms: Platform[];
    maxAllocation: number;
    promo: Promo | null;
    marketType: 'Futures' | 'CFD';
    description: string;
    minDeposit: number;
    profitSplit: string;
    evaluationPrograms?: EvaluationProgram[];
}

export interface AllocationRange {
    label: string;
    min: number;
    max: number;
}

export interface YearsRange {
    label: string;
    min: number;
    max: number;
}

export interface AdvancedFiltersState {
    platforms: string[];
    allocation: (AllocationRange & { id: string }) | null;
    countries: string[];
    years: (YearsRange & { id: string }) | null;
    promotionsOnly: boolean;
}

export interface ProgramToCompare {
    firmId: number;
    programId: string;
}

export interface DetailedProgramToCompare extends EvaluationProgram {
    firmId: number;
    firmName: string;
    firmLogoUrl: string;
}

export type Theme = 'light' | 'dark';

export type SortableKeys = 'name' | 'rating' | 'maxAllocation' | 'country' | 'yearsInOp' | 'minDeposit';

export type SortDirection = 'ascending' | 'descending';

export interface SortConfig {
    key: SortableKeys;
    direction: SortDirection;
}

export type DrawdownType = 'static' | 'trailing_intraday' | 'trailing_eod';
