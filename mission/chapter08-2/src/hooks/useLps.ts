import { useQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lpApi';

const useLps = (order: 'asc' | 'desc') => {
  return useQuery({
    queryKey: ['lps', order], 
    queryFn: () => getLps(order),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,   
  });
};

export default useLps;