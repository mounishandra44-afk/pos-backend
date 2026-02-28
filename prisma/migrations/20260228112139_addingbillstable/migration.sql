-- CreateTable
CREATE TABLE "bills" (
    "id" UUID NOT NULL,
    "salesamount" DECIMAL(10,2) NOT NULL,
    "salesCount" INTEGER NOT NULL,
    "shopId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bills_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bills" ADD CONSTRAINT "bills_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop_Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
