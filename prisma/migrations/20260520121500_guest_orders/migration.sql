-- Allow guest orders
ALTER TABLE "Order" ALTER COLUMN "userId" DROP NOT NULL;

-- Add guestKey for guest order history
ALTER TABLE "Order" ADD COLUMN "guestKey" TEXT;
CREATE INDEX "Order_guestKey_idx" ON "Order"("guestKey");

-- Update FK to SET NULL when user deleted
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Order"
  ADD CONSTRAINT "Order_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

