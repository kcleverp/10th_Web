import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { withdrawUser } from '../apis/auth';
import Modal from './Modal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isStatic?: boolean;
  onLogout: () => void;
  logoutPending?: boolean;
  search: string;
  onSearchChange: (value: string) => void;
}

const Sidebar = ({
  isOpen,
  onClose,
  isStatic = false,
  onLogout,
  logoutPending = false,
  search,
  onSearchChange,
}: SidebarProps) => {
  const navigate = useNavigate();
  const { user, clearLocalSession } = useAuth();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  const withdrawMutation = useMutation({
    mutationFn: withdrawUser,
    onSuccess: () => {
      clearLocalSession();
      setWithdrawModalOpen(false);
      if (!isStatic) onClose();
      navigate('/login');
    },
  });

  const handleNavigate = (path: string) => {
    navigate(path);
    if (!isStatic) onClose();
  };

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStatic) onClose();
  };

  const content = (
    <div className="flex flex-col h-full bg-white">
      <div className="p-5 border-b border-[#eee]">
        <form onSubmit={handleSearch} className="flex flex-col gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="태그명을 입력하세요"
            className="w-full border border-[#ccc] rounded-sm px-3 py-2 text-xs outline-none focus:border-[#807bff] transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-[#807bff] text-white py-2 rounded-sm text-xs font-medium hover:bg-[#6c63ff] transition-colors"
          >
            SEARCH
          </button>
        </form>
      </div>

      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#f8f8ff] hover:text-[#807bff] rounded-sm transition-all text-left group"
        >
          <span className="group-hover:scale-110 transition-transform">🏠</span>
          <span className="font-medium">홈으로 가기</span>
        </button>

        {user && (
          <button
            type="button"
            onClick={() => handleNavigate('/me')}
            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-[#f8f8ff] hover:text-[#807bff] rounded-sm transition-all text-left group"
          >
            <span className="group-hover:scale-110 transition-transform">👤</span>
            <span className="font-medium">마이페이지</span>
          </button>
        )}
      </nav>

      <div className="p-5 border-t border-[#eee] bg-[#fafafa]">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-bold text-gray-700">{user.name}님</span>
            </div>
            <button
              type="button"
              disabled={logoutPending}
              onClick={() => {
                onLogout();
                if (!isStatic) onClose();
              }}
              className="text-[11px] text-gray-400 hover:text-red-500 underline underline-offset-4 transition-colors text-left disabled:opacity-50"
            >
              로그아웃 하시겠습니까?
            </button>
            <button
              type="button"
              onClick={() => setWithdrawModalOpen(true)}
              className="text-[11px] text-gray-400 hover:text-red-600 underline underline-offset-4 transition-colors text-left"
            >
              탈퇴하기
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleNavigate('/login')}
              className="w-full border border-[#ccc] py-2 text-xs font-medium text-gray-600 hover:bg-white transition-colors rounded-sm"
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('/signup')}
              className="w-full text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const withdrawModal =
    withdrawModalOpen && user ? (
      <Modal
        isOpen={true}
        onClose={() => setWithdrawModalOpen(false)}
        closeDisabled={withdrawMutation.isPending}
        zIndex={110}
        panelClassName="w-full max-w-sm bg-white border border-[#eee] shadow-2xl rounded-sm p-6 flex flex-col gap-4"
      >
        <p className="text-sm font-bold text-gray-800 leading-relaxed">
          정말 탈퇴하시겠습니까? 모든 게시글·댓글·좋아요와 회원 정보가 삭제됩니다.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            disabled={withdrawMutation.isPending}
            onClick={() => setWithdrawModalOpen(false)}
            className="px-4 py-2 border border-[#ccc] text-[10px] font-black tracking-widest rounded-sm hover:bg-gray-50 disabled:opacity-50"
          >
            아니오
          </button>
          <button
            type="button"
            disabled={withdrawMutation.isPending}
            onClick={() => withdrawMutation.mutate()}
            className="px-4 py-2 bg-black text-white text-[10px] font-black tracking-widest rounded-sm hover:bg-red-600 disabled:opacity-50"
          >
            예
          </button>
        </div>
      </Modal>
    ) : null;

  if (isStatic) {
    return (
      <>
        <aside className="h-full w-64 border-r border-[#eee] hidden lg:block">{content}</aside>
        {withdrawModal}
      </>
    );
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#eee]">
          <h2 className="text-sm font-black tracking-widest text-[#807bff]">MENU</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {content}
      </aside>
      {withdrawModal}
    </>
  );
};

export default Sidebar;
