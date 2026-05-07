import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../component/SideBar'
import { useAuth } from '../context/AuthContext';

const HomeLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isStatic={false} 
      />
      
      <div className="hidden lg:block w-64 border-r border-[#eee]">
        <Sidebar isOpen={true} onClose={() => {}} isStatic={true} />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-[#eee] flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-1 hover:bg-gray-100 rounded-sm transition-colors text-gray-600"
            >
              <svg width="28" height="28" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
              </svg>
            </button>
            <h1 
              onClick={() => navigate('/')} 
              className="text-lg font-black tracking-tighter cursor-pointer hover:text-[#807bff] transition-colors">
              LP PROJECT
            </h1>
          </div>

          <div className="text-sm">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">
                  <span className="text-[#807bff] font-bold">{user.name}</span>님 반갑습니다.
                </span>
              </div>
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
          <Outlet />
          <button
            onClick={() => navigate('/write')}
            className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#807bff] hover:-translate-y-1 transition-all z-40 group"
          >
            <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
          </button>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;