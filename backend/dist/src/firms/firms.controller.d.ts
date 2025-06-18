import { FirmsService } from './firms.service';
import { MarketType } from '@prisma/client';
export declare class FirmsController {
    private readonly firmsService;
    constructor(firmsService: FirmsService);
    findAll(marketType?: MarketType, search?: string, platform?: string): Promise<({
        platforms: {
            id: number;
            name: string;
        }[];
        evaluationPrograms: {
            id: number;
            name: string;
            profitSplit: string | null;
            createdAt: Date;
            programId: string;
            price: number | null;
            profitTarget: string | null;
            maxDrawdown: string | null;
            dailyLossLimit: string | null;
            minTradingDays: string | null;
            maxPositions: string | null;
            leverage: string | null;
            consistencyRules: string | null;
            keyRestrictions: string | null;
            maxTotalLoss: string | null;
            drawdownType: string | null;
            maxContracts: string | null;
            scalingPlan: string | null;
            resetFee: string | null;
            oneTimeFee: string | null;
            firmId: number;
        }[];
    } & {
        id: number;
        name: string;
        logoUrl: string | null;
        likes: number;
        rating: number;
        reviews: number;
        country: string;
        countryFlag: string;
        yearsInOp: number;
        assets: string[];
        maxAllocation: number;
        promo: import("@prisma/client/runtime/library").JsonValue | null;
        marketType: import(".prisma/client").$Enums.MarketType;
        description: string;
        minDeposit: number;
        profitSplit: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        platforms: {
            id: number;
            name: string;
        }[];
        evaluationPrograms: {
            id: number;
            name: string;
            profitSplit: string | null;
            createdAt: Date;
            programId: string;
            price: number | null;
            profitTarget: string | null;
            maxDrawdown: string | null;
            dailyLossLimit: string | null;
            minTradingDays: string | null;
            maxPositions: string | null;
            leverage: string | null;
            consistencyRules: string | null;
            keyRestrictions: string | null;
            maxTotalLoss: string | null;
            drawdownType: string | null;
            maxContracts: string | null;
            scalingPlan: string | null;
            resetFee: string | null;
            oneTimeFee: string | null;
            firmId: number;
        }[];
    } & {
        id: number;
        name: string;
        logoUrl: string | null;
        likes: number;
        rating: number;
        reviews: number;
        country: string;
        countryFlag: string;
        yearsInOp: number;
        assets: string[];
        maxAllocation: number;
        promo: import("@prisma/client/runtime/library").JsonValue | null;
        marketType: import(".prisma/client").$Enums.MarketType;
        description: string;
        minDeposit: number;
        profitSplit: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
