/*
  Warnings:

  - You are about to drop the column `logo` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Shop` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Shop` table. All the data in the column will be lost.
  - Added the required column `company_name` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_location` to the `Shop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_name` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "logo",
DROP COLUMN "name",
ADD COLUMN     "company_logo" TEXT,
ADD COLUMN     "company_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "location",
DROP COLUMN "name",
ADD COLUMN     "shop_location" TEXT NOT NULL,
ADD COLUMN     "shop_name" TEXT NOT NULL;
