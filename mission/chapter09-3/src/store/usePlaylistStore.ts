import { create } from 'zustand'
import cartItems from '../constants/cartItems'
import type { CartItem, PlaylistStore } from '../types/cart'

function recalculateTotals(items: CartItem[]) {
  let amount = 0
  let total = 0
  for (const item of items) {
    amount += item.amount
    total += item.amount * Number(item.price)
  }
  return { amount, total }
}

const initialCartItems = cartItems.map((item) => ({ ...item }))
const initialTotals = recalculateTotals(initialCartItems)

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  cartItems: initialCartItems,
  amount: initialTotals.amount,
  total: initialTotals.total,
  isOpen: false,

  increase: (id) =>
    set((state) => {
      const cartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      )
      return { cartItems, ...recalculateTotals(cartItems) }
    }),

  decrease: (id) =>
    set((state) => {
      const target = state.cartItems.find((item) => item.id === id)
      if (!target) return state

      const cartItems =
        target.amount <= 1
          ? state.cartItems.filter((item) => item.id !== id)
          : state.cartItems.map((item) =>
              item.id === id ? { ...item, amount: item.amount - 1 } : item,
            )

      return { cartItems, ...recalculateTotals(cartItems) }
    }),

  removeItem: (id) =>
    set((state) => {
      const cartItems = state.cartItems.filter((item) => item.id !== id)
      return { cartItems, ...recalculateTotals(cartItems) }
    }),

  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  calculateTotals: () =>
    set((state) => recalculateTotals(state.cartItems)),

  openModal: () => set({ isOpen: true }),

  closeModal: () => set({ isOpen: false }),
}))
