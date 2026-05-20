import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Sidebar from '../component/SideBar';
import LpFormModal from '../component/LpFormModal';
import { useAuth } from '../context/AuthContext';
import { LpModalOutletContext } from '../context/LpModalOutletContext';
import type { HomeLayoutOutletContext } from '../types/layout';
import type { Lp } from '../types/common';

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [lpModalOpen, setLpModalOpen] = useState(false);
  const [lpModalMode, setLpModalMode] = useState<'create' | 'edit'>('create');
  const [editLp, setEditLp] = useState<Lp | null>(null);

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/'),
  });

  const openLpModalCreate = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLpModalMode('create');
    setEditLp(null);
    setLpModalOpen(true);
  };

  const openLpModalEdit = (lp: Lp) => {
    setLpModalMode('edit');
    setEditLp(lp);
    setLpModalOpen(true);
  };

  const outletContext: HomeLayoutOutletContext = {
    openLpModalCreate,
    openLpModalEdit,
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isStatic={false}
        onLogout={() => logoutMutation.mutate()}
        logoutPending={logoutMutation.isPending}
      />

      <div className="hidden lg:block w-64 border-r border-[#eee]">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          isStatic={true}
          onLogout={() => logoutMutation.mutate()}
          logoutPending={logoutMutation.isPending}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[#eee] flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-sm transition-colors text-gray-600"
              type="button"
            >
              <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                  d="M7.95 11.95h32m-32 12h32m-32 12h32"
                />
              </svg>
            </button>
            <h1
              onClick={() => navigate('/')}
              className="text-lg font-black tracking-tighter cursor-pointer hover:text-[#807bff] transition-colors"
            >
              LP PROJECT
            </h1>
          </div>

          <div className="text-sm flex items-center gap-3">
            {user ? (
              <>
                <span className="font-medium text-gray-700">
                  <span className="text-[#807bff] font-bold">{user.name}</span>님 반갑습니다.
                </span>
                <button
                  type="button"
                  disabled={logoutMutation.isPending}
                  onClick={() => logoutMutation.mutate()}
                  className="text-[10px] font-black tracking-widest text-gray-400 hover:text-black transition-colors disabled:opacity-50"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-gray-400 hover:text-black transition-colors"
              >
                LOGIN / SIGNUP
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 relative">
          <LpModalOutletContext.Provider value={outletContext}>
            <Outlet />
          </LpModalOutletContext.Provider>
          <button
            type="button"
            onClick={openLpModalCreate}
            className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#807bff] hover:-translate-y-1 transition-all z-40 group"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
          </button>
        </main>
      </div>

      <LpFormModal
        isOpen={lpModalOpen}
        onClose={() => setLpModalOpen(false)}
        mode={lpModalMode}
        initialLp={editLp}
      />
    </div>
  );
};

export default HomeLayout;
