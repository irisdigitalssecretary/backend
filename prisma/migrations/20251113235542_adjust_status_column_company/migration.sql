/*
  Warnings:

  - You are about to drop the column `statyu` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "statyu",
ADD COLUMN     "status" "CompanyStatus" NOT NULL DEFAULT 'onboarding';
