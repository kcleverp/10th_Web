import { useEffect, useRef, useState } from 'react';

export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdatedRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastUpdatedRef.current;

    if (elapsed >= interval) {
      setThrottledValue(value);
      lastUpdatedRef.current = now;
      return;
    }

    const timer = setTimeout(() => {
      setThrottledValue(value);
      lastUpdatedRef.current = Date.now();
    }, interval - elapsed);

    return () => {
      clearTimeout(timer);
    };
  }, [value, interval]);

  return throttledValue;
}
