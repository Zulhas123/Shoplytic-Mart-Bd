-- Add PaymentMethod enum
CREATE TYPE "PaymentMethod" AS ENUM ('BKASH', 'NAGAD', 'MANUAL');

-- Add payment fields to Order
ALTER TABLE "Order" ADD COLUMN "paymentMethod" "PaymentMethod";
ALTER TABLE "Order" ADD COLUMN "paymentReference" TEXT;
ALTER TABLE "Order" ADD COLUMN "paidAt" TIMESTAMP(3);

