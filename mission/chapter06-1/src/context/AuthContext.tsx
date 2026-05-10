import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { postLogout, signin } from '../apis/auth';
import type { RequestSignIn } from '../types/authType';

interface User {
  id: number
  email: string;
  name: string; 
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (signInData: RequestSignIn) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { 
    value: user, 
    setItem: setUser, 
    removeItem: removeUser 
  } = useLocalStorage<User>(LOCAL_STORAGE_KEY.user);

  const { 
    value: accessToken, 
    setItem: setAccessToken, 
    removeItem: removeAccessToken 
  } = useLocalStorage<string>(LOCAL_STORAGE_KEY.accessToken);

  const { 
    setItem: setRefreshToken, 
    removeItem: removeRefreshToken 
  } = useLocalStorage<string>(LOCAL_STORAGE_KEY.refreshToken);

  const isAuthenticated = useMemo(() => !!accessToken && !!user, [accessToken, user]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = useCallback(async (signInData: RequestSignIn) => {
    try {
      const response = await signin(signInData);

      if (response && response.data) {
        const { email, name, nickname, accessToken, refreshToken, id } = response.data;
        
        const userName = name || nickname || "사용자";

        setUser({ 
          id,
          email, 
          name: userName 
        });
        
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        alert(`${userName}님, 환영합니다!`);
      }
    } catch (error) {
      console.error("로그인 프로세스 에러:", error);
      throw error;
    }
  }, [setUser, setAccessToken, setRefreshToken]);

  const logout = useCallback(async () => {
    try {
      await postLogout();
    } catch (error) {
      console.error("로그아웃 API 실패(클라이언트 세션은 강제 종료):", error);
    } finally {
      removeUser();
      removeAccessToken();
      removeRefreshToken();
    }
  }, [removeUser, removeAccessToken, removeRefreshToken]);

  // Context Value 메모이제이션
  const value = useMemo(() => ({
    user,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout
  }), [user, accessToken, isAuthenticated, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};