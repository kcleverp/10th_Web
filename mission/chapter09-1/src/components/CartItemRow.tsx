import type { CartItem } from '../types/cart'
import { useAppDispatch } from '../store/hooks'
import { decrease, increase, removeItem } from '../store/cartSlice'

type CartItemRowProps = {
  item: CartItem
}

const CartItemRow = ({ item }: CartItemRowProps) => {
  const dispatch = useAppDispatch()

  return (
    <article className="flex items-center justify-between border-b border-gray-200 py-4">
      <div className="flex items-center gap-4">
        <img
          src={item.img}
          alt={item.title}
          className="h-20 w-20 rounded-md object-cover"
        />
        <div>
          <h3 className="font-bold text-gray-900">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.singer}</p>
          <p className="font-bold text-gray-900">${item.price}</p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex overflow-hidden rounded-md border border-gray-300">
          <button
            type="button"
            onClick={() => dispatch(decrease(item.id))}
            className="bg-gray-200 px-3 py-1 text-gray-800 hover:bg-gray-300"
            aria-label={`${item.title} 수량 감소`}
          >
            -
          </button>
          <span className="min-w-[2.5rem] border-x border-gray-300 bg-white px-3 py-1 text-center">
            {item.amount}
          </span>
          <button
            type="button"
            onClick={() => dispatch(increase(item.id))}
            className="bg-gray-200 px-3 py-1 text-gray-800 hover:bg-gray-300"
            aria-label={`${item.title} 수량 증가`}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => dispatch(removeItem(item.id))}
          className="ml-4 text-red-500 hover:text-red-700"
          aria-label={`${item.title} 삭제`}
        >
          ✕
        </button>
      </div>
    </article>
  )
}

export default CartItemRow
