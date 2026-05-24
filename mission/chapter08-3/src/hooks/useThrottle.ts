import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecutedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const now = Date.now();
    const remaining = lastExecutedRef.current + interval - now;

    const execute = () => {
      lastExecutedRef.current = Date.now();
      setThrottledValue(valueRef.current);
      timerRef.current = null;
    };

    if (remaining <= 0) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      execute();
    } else if (!timerRef.current) {
      timerRef.current = setTimeout(execute, remaining);
    }
  }, [value, interval]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return throttledValue;
}
