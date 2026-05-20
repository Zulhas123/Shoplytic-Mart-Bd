import type { Order } from "@/domain/entities/Order";

export type CreateOrderInput = {
  userId?: string | null;
  guestKey?: string | null;
  shipping: {
    name: string;
    email?: string | null;
    address1: string;
    address2?: string | null;
    city: string;
    postal: string;
  };
  items: Array<{ productId: string; name: string; priceCents: number; quantity: number }>;
};

export interface OrderRepository {
  create(input: CreateOrderInput): Promise<Order>;
  listByUserId(userId: string): Promise<Order[]>;
  getByIdForUser(orderId: string, userId: string): Promise<Order | null>;
  listByGuestKey(guestKey: string): Promise<Order[]>;
  getByIdForGuestKey(orderId: string, guestKey: string): Promise<Order | null>;
  listAll(): Promise<Order[]>;
  updateStatus(orderId: string, status: Order["status"]): Promise<Order>;
  submitPayment(
    orderId: string,
    input: { paymentMethod: NonNullable<Order["paymentMethod"]>; paymentReference: string }
  ): Promise<Order>;
}
