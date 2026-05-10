import { create } from "zustand";

interface CartItem { id: number; name: string; price: number; quantity: number; image_url?: string; }
interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  add: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    if (existing) {
      set({ items: get().items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) });
    } else {
      set({ items: [...get().items, { ...item, quantity: 1 }] });
    }
  },
  remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
}));
