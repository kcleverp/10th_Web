import type { ReactNode } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  closeDisabled?: boolean;
  title?: ReactNode;
  children: ReactNode;
  panelClassName?: string;
  zIndex?: 100 | 110;
};

const Modal = ({
  isOpen,
  onClose,
  closeDisabled = false,
  title,
  children,
  panelClassName = 'w-full max-w-md max-h-[90vh] overflow-y-auto bg-white shadow-2xl border border-[#eee] rounded-sm p-6 flex flex-col gap-4',
  zIndex = 100,
}: ModalProps) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (closeDisabled) return;
    onClose();
  };

  const zClass = zIndex === 110 ? 'z-[110]' : 'z-[100]';

  return (
    <div
      className={`fixed inset-0 ${zClass} flex items-center justify-center bg-black/20 backdrop-blur-sm px-4`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={panelClassName}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title != null && (
          <div className="flex justify-between items-start border-b border-[#f0f0f0] pb-4">
            {typeof title === 'string' ? (
              <h2 className="text-sm font-black tracking-widest text-[#807bff]">{title}</h2>
            ) : (
              title
            )}
            <button
              type="button"
              onClick={handleClose}
              disabled={closeDisabled}
              className="text-gray-400 hover:text-black text-lg leading-none px-1 disabled:opacity-50"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
