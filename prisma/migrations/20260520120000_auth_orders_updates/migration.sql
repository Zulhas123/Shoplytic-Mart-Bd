-- Add new OrderStatus enum values
ALTER TYPE "OrderStatus" ADD VALUE 'CONFIRMED';
ALTER TYPE "OrderStatus" ADD VALUE 'REJECTED';

-- Make user email optional
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;

-- Enforce unique usernames
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- Make shipping email optional
ALTER TABLE "Order" ALTER COLUMN "shippingEmail" DROP NOT NULL;

