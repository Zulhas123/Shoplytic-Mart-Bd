export type DeliveryAgentStatus = "ACTIVE" | "INACTIVE";
export type DeliveryStatus = "ASSIGNED" | "PENDING" | "COMPLETED" | "CANCELED";
export type DeliveryPaymentStatus = "UNPAID" | "PAID" | "COD";

export type DeliveryAgent = {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicleType: string;
  deliveryZone: string;
  status: DeliveryAgentStatus;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type DeliveryItemSnapshot = {
  productId: string;
  productName: string;
  quantity: number;
  categoryId: string | null;
  categoryName: string | null;
  priceCents: number;
  lineTotalCents: number;
};

export type DeliveryCustomerSnapshot = {
  name: string;
  phone: string | null;
  email: string | null;
  address1: string;
  address2: string | null;
  city: string;
  postal: string;
};

export type Delivery = {
  id: string;
  orderId: string;
  agentId: string;
  status: DeliveryStatus;
  paymentStatus: DeliveryPaymentStatus;
  deliveryChargeCents: number;
  totalAmountCents: number;
  deliveredAt: Date | null;
  canceledAt: Date | null;
  deliveryDate: Date | null;
  customerSnapshot: DeliveryCustomerSnapshot;
  itemsSnapshot: DeliveryItemSnapshot[];
  categoryBreakdown: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
};

