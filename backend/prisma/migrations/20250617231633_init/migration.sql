/*
  Warnings:

  - You are about to drop the column `consistencyRules` on the `EvaluationProgram` table. All the data in the column will be lost.
  - You are about to drop the column `drawdownType` on the `EvaluationProgram` table. All the data in the column will be lost.
  - You are about to drop the column `keyRestrictions` on the `EvaluationProgram` table. All the data in the column will be lost.
  - You are about to drop the column `maxContracts` on the `EvaluationProgram` table. All the data in the column will be lost.
  - You are about to drop the column `maxTotalLoss` on the `EvaluationProgram` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EvaluationProgram" DROP COLUMN "consistencyRules",
DROP COLUMN "drawdownType",
DROP COLUMN "keyRestrictions",
DROP COLUMN "maxContracts",
DROP COLUMN "maxTotalLoss",
ADD COLUMN     "leverage" TEXT,
ADD COLUMN     "maxDrawdown" TEXT,
ADD COLUMN     "maxPositions" TEXT,
ADD COLUMN     "oneTimeFee" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "profitSplit" TEXT,
ADD COLUMN     "resetFee" TEXT,
ADD COLUMN     "scalingPlan" TEXT;
