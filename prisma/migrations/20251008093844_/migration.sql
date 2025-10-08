-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "store_city" TEXT NOT NULL DEFAULT 'aa',
ADD COLUMN     "store_country" TEXT NOT NULL DEFAULT 'aa',
ADD COLUMN     "store_phone" TEXT NOT NULL DEFAULT 'aa',
ALTER COLUMN "store_name" SET DEFAULT 'aa';
