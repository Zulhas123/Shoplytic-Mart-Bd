export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED";

export type PaymentMethod = "BKASH" | "NAGAD" | "MANUAL";

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string | null;
  guestKey?: string | null;
  status: OrderStatus;
  paymentMethod?: PaymentMethod | null;
  paymentReference?: string | null;
  paidAt?: Date | null;
  shippingName: string;
  shippingEmail: string | null;
  shippingPhone: string | null;
  shippingAddress1: string;
  shippingAddress2: string | null;
  shippingCity: string;
  shippingPostal: string;
  totalCents: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
};
