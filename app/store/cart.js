import { create } from 'zustand'

export const useCartStore = create((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (index) =>
    set((state) => {
      const updated = [...state.cart]
      updated.splice(index, 1)
      return { cart: updated }
    }),
  clearCart: () => set({ cart: [] }),
}))
