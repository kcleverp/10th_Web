import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import type { ResponseMyInfo } from "../types/authType";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Mypage = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  const [data, setData] = useState<ResponseMyInfo | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      alert("로그인이 필요한 페이지입니다.");
      navigate("/login");
      return;
    }

    const getData = async () => {
      try {
        setIsDataLoading(true);
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error("내 정보 불러오기 실패:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isAuthenticated) {
      getData();
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };


  if (isAuthLoading || isDataLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <p className="text-gray-400 animate-pulse text-sm font-medium tracking-widest">
          LOADING USER DATA...
        </p>
      </div>
    );
  }

  
  if (!data || !data.data) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <p className="text-red-400 text-sm italic">USER NOT FOUND.</p>
      </div>
    );
  }


  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-6">
      <div className="flex flex-col items-center border border-[#eee] bg-white p-12 rounded-2xl shadow-sm">
        <div className="w-20 h-20 bg-[#807bff10] rounded-full flex items-center justify-center mb-6">
          <span className="text-[#807bff] text-3xl font-black">
            {data.data.name[0].toUpperCase()}
          </span>
        </div>
        
        <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-1">
          {data.data.name}
        </h1>
        <p className="text-sm text-gray-400 tracking-widest uppercase font-bold mb-8">
          {data.data.email}
        </p>

        <div className="w-full h-[1px] bg-[#f0f0f0] mb-8" />

        <button 
          className="w-full max-w-[200px] py-4 border border-black text-black text-[10px] font-black tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300" 
          onClick={handleLogout}
        >
          LOGOUT SYSTEM
        </button>
      </div>
    </div>
  );
};

export default Mypage;