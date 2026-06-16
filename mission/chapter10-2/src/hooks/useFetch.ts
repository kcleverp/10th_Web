import { useEffect, useState } from 'react';
import axiosClient from '../apis/axiosClient';

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    let isCancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<T>(url);
        if (!isCancelled) {
          setData(response.data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  return { data, error, isLoading };
}
