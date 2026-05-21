-- Delivery agent status enum
CREATE TYPE "DeliveryAgentStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- Delivery status enum
CREATE TYPE "DeliveryStatus" AS ENUM ('ASSIGNED', 'PENDING', 'COMPLETED', 'CANCELED');

-- Delivery payment status enum
CREATE TYPE "DeliveryPaymentStatus" AS ENUM ('UNPAID', 'PAID', 'COD');

-- Create DeliveryAgent table
CREATE TABLE "DeliveryAgent" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "vehicleType" TEXT NOT NULL,
  "deliveryZone" TEXT NOT NULL,
  "status" "DeliveryAgentStatus" NOT NULL DEFAULT 'ACTIVE',
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "DeliveryAgent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeliveryAgent_phone_key" ON "DeliveryAgent"("phone");

-- Create Delivery table
CREATE TABLE "Delivery" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "agentId" TEXT NOT NULL,
  "status" "DeliveryStatus" NOT NULL DEFAULT 'ASSIGNED',
  "paymentStatus" "DeliveryPaymentStatus" NOT NULL DEFAULT 'UNPAID',
  "deliveryChargeCents" INTEGER NOT NULL DEFAULT 0,
  "totalAmountCents" INTEGER NOT NULL,
  "deliveredAt" TIMESTAMP(3),
  "canceledAt" TIMESTAMP(3),
  "deliveryDate" TIMESTAMP(3),
  "customerSnapshot" JSONB NOT NULL,
  "itemsSnapshot" JSONB NOT NULL,
  "categoryBreakdown" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Delivery_orderId_key" ON "Delivery"("orderId");
CREATE INDEX "Delivery_agentId_idx" ON "Delivery"("agentId");
CREATE INDEX "Delivery_status_idx" ON "Delivery"("status");
CREATE INDEX "Delivery_paymentStatus_idx" ON "Delivery"("paymentStatus");

ALTER TABLE "Delivery"
ADD CONSTRAINT "Delivery_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Delivery"
ADD CONSTRAINT "Delivery_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "DeliveryAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

