-- CreateTable
CREATE TABLE "DailyTransactions" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "totalTransactionCount" INTEGER NOT NULL DEFAULT 0,
    "totalTransactionAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "shopId" UUID NOT NULL,

    CONSTRAINT "DailyTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyTransactions_shopId_date_key" ON "DailyTransactions"("shopId", "date");

-- AddForeignKey
ALTER TABLE "DailyTransactions" ADD CONSTRAINT "DailyTransactions_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop_Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
