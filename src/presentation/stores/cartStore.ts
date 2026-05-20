"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((it) => it.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((it) =>
                it.productId === item.productId
                  ? { ...it, quantity: it.quantity + 1 }
                  : it
              )
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((it) => it.productId !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((it) => (it.productId === productId ? { ...it, quantity } : it))
            .filter((it) => it.quantity > 0)
        })),
      clear: () => set({ items: [] })
    }),
    { name: "shoplytic-cart" }
  )
);

