import type { Order } from "@/domain/entities/Order";

export type CreateOrderInput = {
  userId: string;
  shipping: {
    name: string;
    email: string;
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
  listAll(): Promise<Order[]>;
}

