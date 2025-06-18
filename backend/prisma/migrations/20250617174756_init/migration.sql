-- CreateEnum
CREATE TYPE "MarketType" AS ENUM ('Futures', 'CFD');

-- CreateTable
CREATE TABLE "Firm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "likes" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviews" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "countryFlag" TEXT NOT NULL,
    "yearsInOp" INTEGER NOT NULL,
    "assets" TEXT[],
    "maxAllocation" INTEGER NOT NULL,
    "promo" JSONB,
    "marketType" "MarketType" NOT NULL,
    "description" TEXT NOT NULL,
    "minDeposit" DOUBLE PRECISION NOT NULL,
    "profitSplit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Firm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationProgram" (
    "id" SERIAL NOT NULL,
    "programId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profitTarget" TEXT,
    "maxTotalLoss" TEXT,
    "drawdownType" TEXT,
    "dailyLossLimit" TEXT,
    "maxContracts" TEXT,
    "consistencyRules" TEXT,
    "minTradingDays" TEXT,
    "keyRestrictions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firmId" INTEGER NOT NULL,

    CONSTRAINT "EvaluationProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FirmPlatforms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_FirmPlatforms_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationProgram_programId_key" ON "EvaluationProgram"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- CreateIndex
CREATE INDEX "_FirmPlatforms_B_index" ON "_FirmPlatforms"("B");

-- AddForeignKey
ALTER TABLE "EvaluationProgram" ADD CONSTRAINT "EvaluationProgram_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES "Firm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FirmPlatforms" ADD CONSTRAINT "_FirmPlatforms_A_fkey" FOREIGN KEY ("A") REFERENCES "Firm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FirmPlatforms" ADD CONSTRAINT "_FirmPlatforms_B_fkey" FOREIGN KEY ("B") REFERENCES "Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;
