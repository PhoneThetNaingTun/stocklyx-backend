/*
  Warnings:

  - You are about to drop the `Shop` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ShopStaffs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Shop" DROP CONSTRAINT "Shop_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShopStaffs" DROP CONSTRAINT "_ShopStaffs_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ShopStaffs" DROP CONSTRAINT "_ShopStaffs_B_fkey";

-- DropTable
DROP TABLE "public"."Shop";

-- DropTable
DROP TABLE "public"."_ShopStaffs";

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "store_name" TEXT NOT NULL,
    "store_location" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StoreStaffs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StoreStaffs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StoreStaffs_B_index" ON "_StoreStaffs"("B");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoreStaffs" ADD CONSTRAINT "_StoreStaffs_A_fkey" FOREIGN KEY ("A") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StoreStaffs" ADD CONSTRAINT "_StoreStaffs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
