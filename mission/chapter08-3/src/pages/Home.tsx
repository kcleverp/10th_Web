import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getLps, getLpsByTag } from '../apis/lpApi';
import { useThrottle } from '../hooks/useThrottle';
import LpCard from '../component/LpChip';
import SkeletonCard from '../component/SkeletonCard';
import type { Lp } from '../types/common';

const STALE_TIME = 60_000;
const GC_TIME = 5 * 60_000;

const Home = () => {
  const [searchParams] = useSearchParams();
  const rawSearch = searchParams.get('search') ?? '';
  const trimmed = rawSearch.trim();
  const isSearchMode = trimmed.length > 0;

  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const { ref, inView } = useInView({
    threshold: 0.5,
  });
  const throttledInView = useThrottle(inView, 3000);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: isSearchMode
      ? (['search', trimmed] as const)
      : (['lps', { order }] as const),
    queryFn: ({ pageParam = 0 }) =>
      isSearchMode
        ? getLpsByTag(trimmed, pageParam as number, 12)
        : getLps(order, pageParam as number, 12),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    initialPageParam: 0,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    placeholderData: keepPreviousData,
  });

  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  useEffect(() => {
    if (throttledInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPageRef.current();
    }
  }, [throttledInView, hasNextPage, isFetchingNextPage]);

  const allLps = data?.pages.flatMap((page) => page.data) || [];
  const showGridSkeleton = isLoading || (isFetching && !isFetchingNextPage && !data);

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
          <h2 className="text-3xl font-black tracking-tighter text-gray-900">
            {isSearchMode ? 'SEARCH' : 'EXPLORE'}
          </h2>
          <p className="text-[10px] text-gray-400 tracking-[0.3em] mt-2 uppercase font-bold">
            {isSearchMode ? `Tag: ${trimmed}` : 'Curated LP Archive'}
          </p>
        </div>

        {!isSearchMode && (
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
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {showGridSkeleton ? (
          [...Array(12).keys()].map((i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {allLps.map((lp: Lp) => (
              <LpCard key={lp.id} lp={lp} />
            ))}

            {isFetchingNextPage &&
              [...Array(4).keys()].map((i) => (
                <SkeletonCard key={`next-loader-${i}`} />
              ))}
          </>
        )}
      </div>

      <div ref={ref} className="h-20 w-full flex items-center justify-center">
        {hasNextPage && !isFetchingNextPage && (
          <p className="text-[10px] text-gray-300 tracking-widest animate-pulse">
            SCROLL TO LOAD MORE
          </p>
        )}
      </div>

      {!showGridSkeleton && allLps.length === 0 && (
        <div className="text-center py-32 animate-in fade-in slide-in-from-bottom-4">
          <p className="text-gray-300 text-xs italic tracking-widest font-bold">NO RECORDS FOUND.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
