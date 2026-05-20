export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  shippingName: string;
  shippingEmail: string;
  shippingAddress1: string;
  shippingAddress2: string | null;
  shippingCity: string;
  shippingPostal: string;
  totalCents: number;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
};

