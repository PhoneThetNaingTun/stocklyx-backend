-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "supplier_email" TEXT,
    "supplier_address" TEXT,
    "supplier_city" TEXT,
    "supplier_country" TEXT,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_email_key" ON "Supplier"("supplier_email");

-- AddForeignKey
ALTER TABLE "Supplier" ADD CONSTRAINT "Supplier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
