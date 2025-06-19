import type { AllocationRange, YearsRange, AdvancedFiltersState, EvaluationProgram } from '@/types';

export const initialAdvancedFilters: AdvancedFiltersState = { platforms: [], allocation: null, countries: [], years: null, promotionsOnly: false };

export const allocationRanges: (AllocationRange & { id: string })[] = [
    { id: 'alloc_any', label: "Any Amount", min: 0, max: Infinity },
    { id: 'alloc_lt50', label: "< $50K", min: 0, max: 49999 },
    { id: 'alloc_50_150', label: "$50K - $150K", min: 50000, max: 150000 },
    { id: 'alloc_150_300', label: "$150K - $300K", min: 150001, max: 300000 },
    { id: 'alloc_gt300', label: "> $300K", min: 300001, max: Infinity },
];

export const yearsRanges: (YearsRange & { id: string })[] = [
    { id: 'years_any', label: "Any Experience", min: 0, max: Infinity },
    { id: 'years_0_1', label: "0-1 Years", min: 0, max: 1 },
    { id: 'years_2_4', label: "2-4 Years", min: 2, max: 4 },
    { id: 'years_5plus', label: "5+ Years", min: 5, max: Infinity },
];

export const MAX_FIRM_COMPARE_ITEMS = 4;
export const MAX_PROGRAM_COMPARE_ITEMS = 4;

export const defaultNavLinks = [
    { to: "/", text: "Home" },
    { to: "/#offers", text: "Offers" },
    { to: "/#best-firms", text: "Best Firms" },
    { to: "/#reviews", text: "Reviews" },
    { to: "/#rules", text: "Rules" },
    { to: "/#brokers", text: "Brokers" },
    { to: "/drawdown-visualizer", text: "Drawdown Visualizer" },
];

export const characteristicsMap: Array<{ key: keyof EvaluationProgram; label: string }> = [
    { key: 'profitTarget', label: 'Profit Target' },
    { key: 'maxTotalLoss', label: 'Max Total Loss' },
    { key: 'drawdownType', label: 'Drawdown Type' },
    { key: 'dailyLossLimit', label: 'Daily Loss Limit' },
    { key: 'maxContracts', label: 'Max Contracts' },
    { key: 'consistencyRules', label: 'Consistency Rules' },
    { key: 'minTradingDays', label: 'Min. Trading Days' },
    { key: 'keyRestrictions', label: 'Key Restrictions' },
];
