import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getLps } from '../apis/lpApi';
import LpCard from '../component/LpChip';
import SkeletonCard from '../component/SkeletonCard';
import type { Lp } from '../types/common';

const Home = () => {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');


  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['lps', { order }],
    queryFn: () => getLps(order, 0, 20),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });

  const lpItems = data?.data || [];


  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400 text-sm italic">데이터를 불러오는 중 오류가 발생했습니다.</p>
        <button 
          onClick={() => refetch()}
          className="px-6 py-2 border border-[#807bff] text-[#807bff] text-[10px] font-black tracking-widest hover:bg-[#f8f8ff] transition-colors"
        >
          RETRY
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
 
      <div className="flex justify-between items-end mb-12 border-b border-[#f0f0f0] pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900">EXPLORE</h2>
          <p className="text-[10px] text-gray-400 tracking-[0.3em] mt-2 uppercase font-bold">
            Curated LP Archive
          </p>
        </div>

   
        <div className="flex gap-6 text-[10px] font-black tracking-widest">
          {(['desc', 'asc'] as const).map((type) => (
            <button 
              key={type}
              onClick={() => setOrder(type)}
              className={`${order === type ? 'text-[#807bff]' : 'text-gray-300'} transition-all hover:text-[#807bff] relative`}
            >
              {type === 'desc' ? 'LATEST' : 'OLDEST'}
              {order === type && (
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#807bff] rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {isLoading ? (
      
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (

          lpItems.map((lp: Lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))
        )}
      </div>

      {!isLoading && lpItems.length === 0 && (
        <div className="text-center py-32 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-gray-300 text-xs italic tracking-widest font-bold">NO RECORDS FOUND.</p>
        </div>
      )}
    </div>
  );
};

export default Home;