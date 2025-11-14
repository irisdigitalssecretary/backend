-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('active', 'inactive', 'blocked', 'onboarding');

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "statyu" "CompanyStatus" NOT NULL DEFAULT 'onboarding';
