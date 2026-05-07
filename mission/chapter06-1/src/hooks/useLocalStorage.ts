import { useState, useEffect, useCallback } from "react";

/**
 * 로컬 스토리지와 리액트 상태를 동기화하는 커스텀 훅
 * @template T 데이터 타입
 * @param key 로컬 스토리지 키
 * @param initialValue 초기값 (선택 사항)
 */
export const useLocalStorage = <T>(key: string, initialValue?: T) => {
  // 1. 초기값 설정: 로컬 스토리지 확인 후 없으면 initialValue 사용
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : (initialValue ?? null);
    } catch (error) {
      console.error(`LocalStorage 초기값 로드 에러 (Key: ${key}):`, error);
      return initialValue ?? null;
    }
  });

  // 2. 값 저장 함수: 로컬 스토리지 업데이트 + 리액트 상태 업데이트
  const setItem = useCallback((value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(`LocalStorage 저장 에러 (Key: ${key}):`, error);
    }
  }, [key]);

  // 3. 값 조회 함수 (필요 시 명시적 호출용)
  const getItem = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`LocalStorage 읽기 에러 (Key: ${key}):`, error);
      return null;
    }
  }, [key]);

  // 4. 값 삭제 함수
  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`LocalStorage 삭제 에러 (Key: ${key}):`, error);
    }
  }, [key]);

  // 5. 외부 탭/창에서의 변경 감지 (Storage Event 동기화)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // 해당 키값이 변경되었고, 동일한 로컬 스토리지 영역일 경우
      if (event.key === key && event.storageArea === localStorage) {
        try {
          const newValue = event.newValue ? JSON.parse(event.newValue) : null;
          setStoredValue(newValue);
        } catch (error) {
          console.error("Storage 이벤트 파싱 에러:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return { value: storedValue, setItem, getItem, removeItem };
};