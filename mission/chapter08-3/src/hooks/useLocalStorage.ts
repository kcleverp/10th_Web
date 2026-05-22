import { useState, useEffect, useCallback } from "react";

function safeJsonParse<T>(raw: string, onCatch: (error: unknown) => T | null): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return onCatch(error);
  }
}

function getInitialStoredValue<T>(key: string, initialValue?: T): T | null {
  const raw = window.localStorage.getItem(key);
  if (raw == null || raw === "") return initialValue ?? null;
  return safeJsonParse<T>(raw, (error) => {
    console.error(`LocalStorage 초기값 로드 에러 (Key: ${key}):`, error);
    return initialValue ?? null;
  });
}

function readLocalStorageJson<T>(key: string): T | null {
  const raw = window.localStorage.getItem(key);
  if (raw == null || raw === "") return null;
  return safeJsonParse<T>(raw, (error) => {
    console.error(`LocalStorage 읽기 에러 (Key: ${key}):`, error);
    return null;
  });
}

function parseStorageEventValue<T>(raw: string | null, errorMessage: string): T | null {
  if (raw == null || raw === "") return null;
  return safeJsonParse<T>(raw, (error) => {
    console.error(errorMessage, error);
    return null;
  });
}

export const useLocalStorage = <T>(key: string, initialValue?: T) => {
  const [storedValue, setStoredValue] = useState<T | null>(() =>
    getInitialStoredValue(key, initialValue)
  );

  const setItem = useCallback((value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(`LocalStorage 저장 에러 (Key: ${key}):`, error);
    }
  }, [key]);

  const getItem = useCallback(() => {
    return readLocalStorageJson<T>(key);
  }, [key]);

  const removeItem = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`LocalStorage 삭제 에러 (Key: ${key}):`, error);
    }
  }, [key]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === localStorage) {
        const newValue = parseStorageEventValue<T>(event.newValue, "Storage 이벤트 파싱 에러:");
        setStoredValue(newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return { value: storedValue, setItem, getItem, removeItem };
};
