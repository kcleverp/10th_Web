import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import cartItems from '../../constants/cartItems'
import type { CartState } from '../../types/cart'

function recalculateTotals(state: CartState) {
  state.amount = 0
  state.total = 0
  for (const item of state.cartItems) {
    state.amount += item.amount
    state.total += item.amount * Number(item.price)
  }
}

const initialCartItems = cartItems.map((item) => ({ ...item }))

const initialState: CartState = {
  cartItems: initialCartItems,
  amount: 0,
  total: 0,
}

recalculateTotals(initialState)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increase: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)
      if (item) {
        item.amount += 1
      }
      recalculateTotals(state)
    },
    decrease: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find((cartItem) => cartItem.id === action.payload)
      if (!item) return

      if (item.amount <= 1) {
        state.cartItems = state.cartItems.filter(
          (cartItem) => cartItem.id !== action.payload,
        )
      } else {
        item.amount -= 1
      }
      recalculateTotals(state)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem.id !== action.payload,
      )
      recalculateTotals(state)
    },
    clearCart: (state) => {
      state.cartItems = []
      state.amount = 0
      state.total = 0
    },
  },
})

export const { increase, decrease, removeItem, clearCart } = cartSlice.actions

export default cartSlice.reducer
