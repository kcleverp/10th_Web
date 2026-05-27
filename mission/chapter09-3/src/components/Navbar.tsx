import { usePlaylistStore } from '../store/usePlaylistStore'

const Navbar = () => {
  const amount = usePlaylistStore((state) => state.amount)

  return (
    <nav className="flex items-center justify-between bg-slate-900 px-8 py-4 text-white">
      <span className="text-lg font-bold">Ohtani Ahn</span>
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
          />
        </svg>
        <span className="font-semibold">{amount}</span>
      </div>
    </nav>
  )
}

export default Navbar
