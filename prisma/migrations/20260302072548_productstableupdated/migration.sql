-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "gst_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gst_percentage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
