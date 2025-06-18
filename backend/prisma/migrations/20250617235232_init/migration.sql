-- AlterTable
ALTER TABLE "EvaluationProgram" ADD COLUMN     "consistencyRules" TEXT,
ADD COLUMN     "drawdownType" TEXT,
ADD COLUMN     "keyRestrictions" TEXT,
ADD COLUMN     "maxContracts" TEXT,
ADD COLUMN     "maxTotalLoss" TEXT;
