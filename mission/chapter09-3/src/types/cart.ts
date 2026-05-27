export interface CartItem {
  id: string
  title: string
  singer: string
  price: string
  img: string
  amount: number
}

export interface CartState {
  cartItems: CartItem[]
  amount: number
  total: number
}

export interface PlaylistState {
  cartItems: CartItem[]
  amount: number
  total: number
  isOpen: boolean
}

export interface PlaylistActions {
  increase: (id: string) => void
  decrease: (id: string) => void
  removeItem: (id: string) => void
  clearCart: () => void
  calculateTotals: () => void
  openModal: () => void
  closeModal: () => void
}

export type PlaylistStore = PlaylistState & PlaylistActions
