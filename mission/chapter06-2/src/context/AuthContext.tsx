import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { postLogout, signin } from '../apis/auth';
import type { RequestSignIn } from '../types/authType';

// 1. 유저 정보 인터페이스 (서버 응답 명세에 맞춰 name 사용)
interface User {
  id: number;
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

  // 로컬 스토리지 인터페이스 (Custom Hook)
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

  // 파생 상태: 인증 여부
  const isAuthenticated = useMemo(() => !!accessToken && !!user, [accessToken, user]);

  // 마운트 시 로딩 해제
  useEffect(() => {
    setIsLoading(false);
  }, []);

  /**
   * 로그인 함수
   */
  const login = useCallback(async (signInData: RequestSignIn) => {
    try {
      const response = await signin(signInData);

      // response.data 구조 분해 할당 시 서버 필드명(name) 확인 필수
      if (response && response.data) {
        const { email, name, nickname, accessToken, refreshToken, id } = response.data;
        
        // 💡 핵심 수정: 서버가 주는 값이 name이라면 name을, nickname이라면 nickname을 사용하세요.
        // Mypage에서 name을 사용했으므로 name을 우선적으로 저장합니다.
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

  /**
   * 로그아웃 함수
   */
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