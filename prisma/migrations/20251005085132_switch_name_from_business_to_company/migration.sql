/*
  Warnings:

  - You are about to drop the column `businessId` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the `Business` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Business" DROP CONSTRAINT "Business_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Shop" DROP CONSTRAINT "Shop_businessId_fkey";

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "businessId",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Business";

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
