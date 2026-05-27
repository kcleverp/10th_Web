import CartItemRow from '../components/CartItemRow'
import { clearCart } from '../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

const CartPage = () => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.cartItems)

  return (
    <section className="mx-auto max-w-5xl px-8 py-6">
      {cartItems.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}

      {cartItems.length > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => dispatch(clearCart())}
            className="rounded-md border border-black px-6 py-2 hover:bg-gray-100"
          >
            전체 삭제
          </button>
        </div>
      )}
    </section>
  )
}

export default CartPage
