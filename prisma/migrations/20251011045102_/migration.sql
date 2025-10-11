/*
  Warnings:

  - Added the required column `companyId` to the `MeasurementUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MeasurementUnit" ADD COLUMN     "companyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "MeasurementUnit" ADD CONSTRAINT "MeasurementUnit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
