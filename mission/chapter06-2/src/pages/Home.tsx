import { useState, useEffect } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getLps } from '../apis/lpApi';
import LpCard from '../component/LpChip';
import SkeletonCard from '../component/SkeletonCard';
import type { Lp } from '../types/common';

const Home = () => {
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  
  // 무한 스크롤 트리거를 위한 hook
  const { ref, inView } = useInView({
    threshold: 0.5, // 대상이 50% 정도 보였을 때 감지
  });

  // 1. useInfiniteQuery로 전환
  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['lps', { order }],
    queryFn: ({ pageParam = 0 }) => getLps(order, pageParam as number, 12),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    initialPageParam: 0,
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });

  // 2. 스크롤 감지 시 다음 페이지 호출
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 3. 2차원 배열인 pages 데이터를 1차원 리스트로 평탄화
  const allLps = data?.pages.flatMap((page) => page.data) || [];

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
      {/* 목록 헤더 및 정렬 섹션 */}
      <div className="flex justify-between items-end mb-12 border-b border-[#f0f0f0] pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-gray-900">EXPLORE</h2>
          <p className="text-[10px] text-gray-400 tracking-[0.3em] mt-2 uppercase font-bold">
            Curated LP Archive
          </p>
        </div>

        {/* 정렬 버튼 */}
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

      {/* 목록 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {isLoading ? (
          // 초기 전체 로딩 시 스켈레톤
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {/* 실제 데이터 렌더링 */}
            {allLps.map((lp: Lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}
            
            {/* 추가 페이지 로딩 중일 때 하단 스켈레톤 표시 (미션 2 필수 항목) */}
            {isFetchingNextPage && 
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={`next-loader-${i}`} />
              ))
            }
          </>
        )}
      </div>

      {/* 무한 스크롤 감지 트리거 지점 */}
      <div ref={ref} className="h-20 w-full flex items-center justify-center">
        {hasNextPage && !isFetchingNextPage && (
          <p className="text-[10px] text-gray-300 tracking-widest animate-pulse">
            SCROLL TO LOAD MORE
          </p>
        )}
      </div>

      {/* 빈 상태 처리 */}
      {!isLoading && allLps.length === 0 && (
        <div className="text-center py-32 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-gray-300 text-xs italic tracking-widest font-bold">NO RECORDS FOUND.</p>
        </div>
      )}
    </div>
  );
};

export default Home;