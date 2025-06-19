export const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
};

export const formatAllocation = (amount: number): string => `$${(amount / 1000)}K`;
