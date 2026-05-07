import { useQuery } from '@tanstack/react-query';
import { getLpDetail } from '../apis/lpApi'; 
import type { Lp } from '../types/common';

const useLpDetail = (lpId: number) => {
  return useQuery<Lp>({

    queryKey: ['lps', 'detail', lpId], 
    
    queryFn: () => getLpDetail(lpId),
    
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,   
  
    enabled: !!lpId && !isNaN(lpId),
  });
};

export default useLpDetail;
