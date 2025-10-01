-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BUYER', 'SCOUT', 'ADMIN');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('CREATED', 'SCOUT_ASSIGNED', 'IN_PROGRESS', 'VERIFIED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "JobTier" AS ENUM ('LITE', 'STANDARD', 'PLUS');

-- CreateEnum
CREATE TYPE "Marketplace" AS ENUM ('FACEBOOK', 'EBAY', 'GUMTREE', 'OTHER');

-- CreateEnum
CREATE TYPE "RiskRecommendation" AS ENUM ('LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK');

-- CreateEnum
CREATE TYPE "ConditionGrade" AS ENUM ('A_PLUS', 'A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "VerificationRecommendation" AS ENUM ('BUY', 'NEGOTIATE', 'REJECT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'HELD', 'RELEASED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BUYER',
    "stripeCustomerId" TEXT,
    "stripeAccountId" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "scoutId" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'CREATED',
    "tier" "JobTier" NOT NULL,
    "listingUrl" TEXT NOT NULL,
    "marketplace" "Marketplace" NOT NULL,
    "itemTitle" TEXT NOT NULL,
    "itemPrice" DECIMAL(10,2) NOT NULL,
    "itemPhotos" TEXT[],
    "description" TEXT,
    "riskScore" INTEGER,
    "riskSignals" TEXT[],
    "riskRecommendation" "RiskRecommendation",
    "riskExplanation" TEXT,
    "scoutFee" DECIMAL(10,2) NOT NULL,
    "totalFee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationReport" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "photos" TEXT[],
    "videoUrl" TEXT,
    "conditionGrade" "ConditionGrade" NOT NULL,
    "defects" TEXT[],
    "recommendation" "VerificationRecommendation" NOT NULL,
    "reportContent" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "buyerAmount" DECIMAL(10,2) NOT NULL,
    "scoutPayout" DECIMAL(10,2) NOT NULL,
    "platformFee" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeAccountId_key" ON "User"("stripeAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationReport_jobId_key" ON "VerificationReport"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_jobId_key" ON "Payment"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_scoutId_fkey" FOREIGN KEY ("scoutId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationReport" ADD CONSTRAINT "VerificationReport_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

