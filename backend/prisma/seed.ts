import { PrismaClient, MarketType } from '@prisma/client';

const prisma = new PrismaClient();

const firmsData = [
    {
        name: 'Apex Trader Funding',
        logoUrl: 'https://apextraderfunding.com/wp-content/uploads/2023/02/LOGOTYPE-01-1-300x75.png',
        likes: 4510, rating: 4.8, reviews: 750, country: 'US', countryFlag: '🇺🇸', yearsInOp: 3,
        assets: ['E-mini S&P 500', 'Crude Oil Futures', 'Gold Futures', 'Nasdaq 100 Futures'],
        platforms: [{ name: 'NinjaTrader' }, { name: 'TradingView' }, { name: 'Tradovate' }, { name: 'Rithmic' }],
        maxAllocation: 300000, promo: { text: '100% of First $25K Profit', code: null }, marketType: 'Futures',
        description: "Based in Austin, Texas, Apex Trader Funding offers generous profit splits and broad platform compatibility.",
        minDeposit: 137, profitSplit: "100% of first $25k, then 90%",
        evaluationPrograms: [
            { programId: 'apex-25k-full', name: '25K FULL', profitTarget: '$1,500', maxTotalLoss: '$1,500', drawdownType: 'Trailing', dailyLossLimit: 'None', maxContracts: '4 (40 micros)', consistencyRules: 'Not specified', minTradingDays: '7', keyRestrictions: 'News trading allowed; no scaling.' },
            { programId: 'apex-50k-full', name: '50K FULL', profitTarget: '$3,000', maxTotalLoss: '$2,500', drawdownType: 'Trailing', dailyLossLimit: 'None', maxContracts: '10 (100 micros)', consistencyRules: 'Not specified', minTradingDays: '7', keyRestrictions: 'News trading allowed; no scaling.' },
            { programId: 'apex-100k-static', name: '100K STATIC', profitTarget: '$6,000', maxTotalLoss: '$2,000', drawdownType: 'Fixed (Static)', dailyLossLimit: '$625', maxContracts: '2 (20 micros)', consistencyRules: 'Not specified', minTradingDays: '7', keyRestrictions: 'News trading allowed; no scaling.' }
        ],
    },
    {
        name: 'Topstep',
        logoUrl: 'https://www.topstep.com/wp-content/uploads/2020/12/topstep-logo.svg',
        likes: 3820, rating: 4.7, reviews: 950, country: 'US', countryFlag: '🇺🇸', yearsInOp: 10,
        assets: ['Euro FX Futures', 'Soybean Futures', 'Silver Futures', 'Corn Futures'],
        platforms: [{ name: 'TopstepX™' }, { name: 'NinjaTrader' }, { name: 'Tradovate' }],
        maxAllocation: 150000, promo: { text: '$149 Activation Fee', code: null }, marketType: 'Futures',
        description: "Chicago-based Topstep is a well-known firm focusing on trader education via its Trading Combine®.",
        minDeposit: 49, profitSplit: "100% of first $10k, then 90%",
        evaluationPrograms: [
            { programId: 'topstep-50k', name: '50k Buying Power', profitTarget: '$3,000', maxTotalLoss: '$2,000', drawdownType: 'End-of-Day Trailing', dailyLossLimit: '$1,000 (Target)', maxContracts: '5', consistencyRules: 'Best day < 50% total profit.', minTradingDays: '2', keyRestrictions: 'No overnight/weekend positions.' },
            { programId: 'topstep-100k', name: '100k Buying Power', profitTarget: '$6,000', maxTotalLoss: '$3,000', drawdownType: 'End-of-Day Trailing', dailyLossLimit: '$2,000 (Target)', maxContracts: '10', consistencyRules: 'Best day < 50% total profit.', minTradingDays: '2', keyRestrictions: 'No overnight/weekend positions.' },
            { programId: 'topstep-150k', name: '150k Buying Power', profitTarget: '$9,000', maxTotalLoss: '$4,500', drawdownType: 'End-of-Day Trailing', dailyLossLimit: '$3,000 (Target)', maxContracts: '15', consistencyRules: 'Best day < 50% total profit.', minTradingDays: '2', keyRestrictions: 'No overnight/weekend positions.' }
        ]
    },
    {
        name: 'Leeloo Trading',
        logoUrl: 'https://www.leelootrading.com/content/websites/shared/images/leeloo-logo-v2.svg',
        likes: 2500, rating: 4.5, reviews: 400, country: 'US', countryFlag: '🇺🇸', yearsInOp: 4,
        assets: ['Gold Futures', 'Silver Futures', 'E-mini S&P 500'],
        platforms: [{ name: 'NinjaTrader' }, { name: 'Rithmic' }],
        maxAllocation: 150000, promo: { text: 'Lifetime PA Option', code: null }, marketType: 'Futures',
        description: "Leeloo Trading from Montana provides flexibility with rules and a dynamic drawdown.",
        minDeposit: 175, profitSplit: "100% of first $10k, then up to 80%",
        evaluationPrograms: [
             { programId: 'leeloo-25k', name: '$25,000 Account', profitTarget: '$1,500', maxTotalLoss: '$1,500', drawdownType: 'Trailing', dailyLossLimit: 'None', maxContracts: '3 minis', consistencyRules: 'Not specified', minTradingDays: '10', keyRestrictions: 'Swing/news trading allowed' },
        ]
    },
    {
        name: 'UProfit Trader',
        logoUrl: 'https://s3-eu-west-1.amazonaws.com/tpd/logos/5dd4566a25e0ee000163cbcc/0x0.png',
        likes: 1800, rating: 4.4, reviews: 300, country: 'US', countryFlag: '🇺🇸', yearsInOp: 2,
        assets: ['Crude Oil Futures', 'Nasdaq 100 Futures'],
        platforms: [{ name: 'TradingView' }, { name: 'Tradovate' }],
        maxAllocation: 200000, promo: { text: 'First $10K Profits 100%', code: null }, marketType: 'Futures',
        description: "UProfit Trader offers global, multilingual support and simple rules with no hidden fees.",
        minDeposit: 39, profitSplit: "100% of first $10k, then 60%",
        evaluationPrograms: [
            { programId: 'uprofit-50k', name: '50K Account', profitTarget: '$2,500', maxTotalLoss: '$2,000', drawdownType: 'End-of-Day Trailing', dailyLossLimit: '$1,100', maxContracts: '6', consistencyRules: 'Best day < 30% profit target.', minTradingDays: 'Not specified', keyRestrictions: 'Consistency rule removed on funded account.' },
        ]
    },
    {
        name: 'Earn2Trade',
        logoUrl: 'https://earn2trade.com/wp-content/uploads/2023/04/logo-e2t.svg',
        likes: 3200, rating: 4.6, reviews: 600, country: 'US', countryFlag: '🇺🇸', yearsInOp: 5,
        assets: ['E-mini S&P 500', 'Nasdaq 100', 'Crude Oil', 'Gold'],
        platforms: [{ name: 'NinjaTrader' }, { name: 'Rithmic' }, { name: 'FinVibe' }],
        maxAllocation: 200000, promo: { text: 'Gauntlet Mini Discount', code: 'E2TPROMO' },
        marketType: 'Futures',
        description: 'Earn2Trade offers various evaluation programs like the Gauntlet Mini™.',
        minDeposit: 150, profitSplit: '80%',
        evaluationPrograms: [
            { programId: 'e2t-tcp25', name: 'TCP25 ($25,000)', profitTarget: '$1,750', maxTotalLoss: '$1,500', drawdownType: 'End-of-Day Trailing', dailyLossLimit: '$550', maxContracts: 'Not specified', consistencyRules: 'Not specified', minTradingDays: 'Not specified', keyRestrictions: 'Not specified' },
        ]
    },
    {
        name: 'OneUp Trader',
        likes: 4100, rating: 4.7, reviews: 700, country: 'US', countryFlag: '🇺🇸', yearsInOp: 3,
        logoUrl: 'https://www.oneuptrader.com/wp-content/uploads/2022/10/oneup-header.svg',
        assets: ['E-mini S&P 500', 'Gold Futures', 'Nasdaq 100 Futures'],
        platforms: [{ name: 'NinjaTrader' }, { name: 'Tradovate' }],
        maxAllocation: 250000, promo: { text: '7-Day Free Trial', code: null }, marketType: 'Futures',
        description: "OneUp Trader features a 1-step evaluation and unlimited free withdrawals.",
        minDeposit: 65, profitSplit: "100% of first $10k, then 90%",
        evaluationPrograms: [
            { programId: 'oneup-25k', name: '$25,000 Account', profitTarget: '$1,500', maxTotalLoss: '$1,500', drawdownType: 'Trailing (stops at initial balance)', dailyLossLimit: 'None', maxContracts: '3', consistencyRules: 'Sum of 3 best days >= 80% of best day.', minTradingDays: '10', keyRestrictions: 'News trading restricted on funded account.'},
        ]
    },
    {
        name: 'Bulenox',
        logoUrl: 'https://bulenox.com/wa-data/public/site/themes/bulenox/img/logo-2.png',
        likes: 2900, rating: 4.6, reviews: 550, country: 'CA', countryFlag: '🇨🇦',
        yearsInOp: 2,
        assets: ['Crude Oil Futures', 'Euro FX Futures'],
        platforms: [{ name: 'Rithmic' }, { name: 'NinjaTrader' }],
        maxAllocation: 150000, promo: { text: 'Low $35 Reset Fee', code: null }, marketType: 'Futures',
        description: "Bulenox offers international service and very low evaluation reset costs.",
        minDeposit: 125, profitSplit: "100% of first $10k, then 90%",
        evaluationPrograms: []
    },
    {
        name: 'TickTickTrader',
        logoUrl: 'https://framerusercontent.com/images/WwxTNeqDeTX0uLbvJvIjKME8g0A.png?scale-down-to=512',
        likes: 2200, rating: 4.5, reviews: 450, country: 'US', countryFlag: '🇺🇸',
        yearsInOp: 1,
        assets: ['E-mini S&P 500', 'Nasdaq 100 Futures'],
        platforms: [{ name: 'NinjaTrader' }, { name: 'Rithmic' }, { name: 'CQG' }],
        maxAllocation: 100000, promo: { text: 'One-Time Activation Fee', code: null }, marketType: 'Futures',
        description: "TickTickTrader uses a one-time activation fee model, eliminating monthly quotas.",
        minDeposit: 149, profitSplit: "80% to trader",
        evaluationPrograms: [
             { programId: 'ticktick-25k-direct', name: '25K Direct Swing', profitTarget: '$1,500', maxTotalLoss: '$1,250', drawdownType: 'Static', dailyLossLimit: '$500', maxContracts: '3', consistencyRules: 'Not specified', minTradingDays: 'None (Direct)', keyRestrictions: 'News trading allowed.' },
        ]
    },
    {
        name: 'TakeProfit Trader',
        logoUrl: 'https://takeprofittrader.com/wp-content/uploads/2021/01/logo-1-300x82.png',
        likes: 1900, rating: 4.3, reviews: 250, country: 'US', countryFlag: '🇺🇸',
        yearsInOp: 3,
        assets: ['Forex Majors', 'Indices', 'Commodities'],
        platforms: [{ name: 'MT4' }, { name: 'MT5' }],
        maxAllocation: 100000, promo: { text: 'Scaling Plan Available', code: null }, marketType: 'CFD',
        description: 'TakeProfit Trader offers funding for forex and CFD traders with clear rules and scaling opportunities.',
        minDeposit: 150, profitSplit: 'Up to 80%',
        evaluationPrograms: [ 
             { programId: 'takeprofit-25k', name: '$25,000 Account', profitTarget: '$1,500', maxTotalLoss: '$1,500', drawdownType: 'Trailing (stops at initial balance)', dailyLossLimit: 'None', maxContracts: '3', consistencyRules: 'Sum of 3 best days >= 80% of best day.', minTradingDays: '10', keyRestrictions: 'News trading restricted on funded account.'},
        ]
    },
    {
        name: 'TradeDay',
        logoUrl: 'https://tradeday.com/wp-content/uploads/2022/10/logo.svg',
        likes: 3100, rating: 4.8, reviews: 500, country: 'UK', countryFlag: '🇬🇧',
        yearsInOp: 4,
        assets: ['Futures', 'Indices', 'Energies'],
        platforms: [{ name: 'Tradovate' }, { name: 'TradingView' }],
        maxAllocation: 150000, promo: { text: 'Funded Account in 10 Days', code: null }, marketType: 'Futures',
        description: 'TradeDay provides a path for futures traders to get funded quickly, with a focus on clear objectives and support.',
        minDeposit: 139, profitSplit: '80% initially',
        evaluationPrograms: [ 
            { programId: 'tradeday-25k', name: '$25,000 Account', profitTarget: 'Not specified', maxTotalLoss: 'Not specified', drawdownType: 'Not specified', dailyLossLimit: 'Not specified', maxContracts: 'Not specified', consistencyRules: 'Best day < 30% total profit.', minTradingDays: '7', keyRestrictions: 'No Tier 1 news trading.'},
        ]
    }
];

async function main() {
  console.log('Start seeding ...');

  for (const firm of firmsData) {
    await prisma.firm.create({
      data: {
        name: firm.name,
        logoUrl: firm.logoUrl,
        likes: firm.likes,
        rating: firm.rating,
        reviews: firm.reviews,
        country: firm.country,
        countryFlag: firm.countryFlag,
        yearsInOp: firm.yearsInOp,
        assets: firm.assets,
        maxAllocation: firm.maxAllocation,
        promo: firm.promo ?? undefined,
        marketType: firm.marketType === 'Futures' ? MarketType.Futures : MarketType.CFD,
        description: firm.description,
        minDeposit: firm.minDeposit,
        profitSplit: firm.profitSplit,
        platforms: {
          connectOrCreate: firm.platforms.map((platform) => ({
            where: { name: platform.name },
            create: { name: platform.name },
          })),
        },
        evaluationPrograms: {
          create: firm.evaluationPrograms?.map((program) => ({
            ...program,
          })),
        },
      },
    });
    console.log(`Created firm with name: ${firm.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
