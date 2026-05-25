import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STAGES = ['confirmed', 'preparing', 'on_the_way', 'delivered'];

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      placeOrder: (order) => {
        const id = `FR${Date.now().toString().slice(-8)}`;
        const newOrder = {
          id,
          ...order,
          status: 'confirmed',
          placedAt: Date.now(),
          // Mocked delivery ETA: ~25 minutes from now.
          etaMinutes: order.etaMinutes ?? 25,
        };
        set({ orders: [newOrder, ...get().orders] });
        return id;
      },

      getOrder: (id) => get().orders.find((o) => o.id === id),

      advanceStatus: (id) => {
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            const idx = STAGES.indexOf(o.status);
            if (idx >= STAGES.length - 1) return o;
            return { ...o, status: STAGES[idx + 1] };
          }),
        }));
      },
    }),
    { name: 'order-store' }
  )
);

export const ORDER_STAGES = STAGES;
export default useOrderStore;
