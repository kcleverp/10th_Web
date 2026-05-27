import { usePlaylistStore } from '../store/usePlaylistStore'

const Footer = () => {
  const { amount, total } = usePlaylistStore()

  return (
    <footer className="border-t border-gray-200 bg-white px-8 py-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-sm">
        <p>
          총 수량: <span className="font-bold">{amount}</span>
        </p>
        <p>
          총 금액: <span className="font-bold">${total}</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
