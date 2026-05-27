import { usePlaylistStore } from '../store/usePlaylistStore'

const Modal = () => {
  const { isOpen, closeModal, clearCart } = usePlaylistStore()

  if (!isOpen) return null

  const handleConfirm = () => {
    clearCart()
    closeModal()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="min-w-[280px] rounded-lg bg-white px-8 py-6 shadow-lg">
        <p className="mb-6 text-center font-bold text-gray-900">
          정말 삭제하시겠습니까?
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={closeModal}
            className="rounded bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300"
          >
            아니요
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
