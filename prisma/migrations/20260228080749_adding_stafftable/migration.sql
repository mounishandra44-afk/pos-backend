-- CreateTable
CREATE TABLE "staff" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" UUID NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop_Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
