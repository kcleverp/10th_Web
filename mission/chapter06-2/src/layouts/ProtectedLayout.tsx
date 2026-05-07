import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const ProtectedLayout = () => {
  const { accessToken, isLoading } = useAuth();
  const location = useLocation();
  const [isReadyToRedirect, setIsReadyToRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !accessToken) {
      alert("로그인이 필요한 서비스입니다.");
      setIsReadyToRedirect(true);
    }
  }, [accessToken, isLoading]);

  if (isLoading) {
    return null; 
  }

  if (!accessToken && isReadyToRedirect) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location.pathname }} 
      />
    );
  }

  return <Outlet />;
};

export default ProtectedLayout;