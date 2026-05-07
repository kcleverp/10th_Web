import { useQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lpApi';

const useLps = (order: 'asc' | 'desc') => {
  return useQuery({
    queryKey: ['lps', order], 
    queryFn: () => getLps(order),
    staleTime: 1000 * 60 * 5, 
    gcTime: 1000 * 60 * 10,   
  });
};

export default useLps;