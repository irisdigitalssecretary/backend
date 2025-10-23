/*
  Warnings:

  - You are about to drop the column `companyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_companyId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "companyId";

-- DropTable
DROP TABLE "public"."Company";
