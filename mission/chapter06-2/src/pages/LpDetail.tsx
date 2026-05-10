import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import useLpDetail from '../hooks/useLpDetail';
import { useAuth } from '../context/AuthContext';
import { likeLp, deleteLp, getLpComments } from '../apis/lpApi';
import CommentSkeleton from '../component/CommentSkeleton'; 

const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { ref, inView } = useInView();

  const [searchParams, setSearchParams] = useSearchParams();
  const order = (searchParams.get('order') as 'desc' | 'asc') || 'desc';

  const setOrder = (newOrder: 'desc' | 'asc') => {
    setSearchParams({ order: newOrder });
  };

  const { data: lp, isLoading, isError, refetch } = useLpDetail(Number(lpId));

  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam = 0 }) => getLpComments(Number(lpId), order, pageParam as number),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    initialPageParam: 0,
    enabled: !!lpId,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allComments = commentData?.pages.flatMap((page) => page.data) || [];

  const isOwner = useMemo(() => {
    if (!user || !lp || !lp.author) return false;
    return user.id === lp.author.id; 
  }, [user, lp]);

  if (isLoading) return <div className="py-20 text-center text-gray-400 animate-pulse">LOADING...</div>;
  if (isError || !lp) return <div className="py-20 text-center text-gray-400">RECORD NOT FOUND.</div>;

  return (
    <div className="flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        
        <div className="flex justify-between items-end border-b pb-4">
          <h1 className="text-2xl font-black tracking-tighter">{lp.title}</h1>
          {isOwner && (
            <div className="flex gap-2 mb-1">
              <button onClick={() => navigate(`/edit/${lp.id}`)} className="text-[10px] text-gray-400 underline">EDIT</button>
              <button 
                onClick={async () => { if(confirm('삭제하시겠습니까?')) { await deleteLp(lp.id); navigate('/'); } }} 
                className="text-[10px] text-gray-400 underline"
              >
                DELETE
              </button>
            </div>
          )}
        </div>

        <img src={lp.thumbnail || 'https://via.placeholder.com/600'} className="w-full aspect-square object-cover border" alt="thumbnail" />

        <div className="flex flex-col gap-2">
           <p className="text-sm text-gray-800 font-bold">{lp.artist}</p>
           <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{lp.content}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {lp.tags.map(tag => <span key={tag.id} className="text-[10px] text-[#807bff] font-bold">#{tag.name}</span>)}
        </div>

        <button
          onClick={async () => {
            if (!user) return navigate('/login');
            await likeLp(lp.id);
            refetch();
          }}
          className="w-full bg-[#807bff] text-white py-4 font-black tracking-widest hover:bg-black transition-colors"
        >
          LIKE ({lp.likes.length})
        </button>

        <div className="h-[2px] bg-gray-50 my-8" />

        <section className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Comment</h3>
          <div className="flex flex-col gap-2">
            <textarea 
              className="w-full h-20 p-3 border border-gray-100 text-xs outline-none focus:border-[#807bff] transition-colors resize-none"
              placeholder="음악에 대한 의견을 남겨주세요."
            />
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-red-400 font-bold italic">내용을 입력해주세요.</span>
              <button className="px-6 py-2 bg-black text-white text-[10px] font-black tracking-widest">
                POST
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[10px] font-black tracking-widest text-gray-400">ARCHIVE ({allComments.length})</span>
            <div className="flex gap-4 text-[9px] font-black">
              <button onClick={() => setOrder('desc')} className={order === 'desc' ? 'text-[#807bff]' : 'text-gray-300'}>LATEST</button>
              <button onClick={() => setOrder('asc')} className={order === 'asc' ? 'text-[#807bff]' : 'text-gray-300'}>OLDEST</button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {isCommentsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <CommentSkeleton key={`init-${i}`} />
              ))
            ) : (
              <>
                {allComments.map((comment: any) => (
                  <div key={comment.id} className="flex flex-col gap-1 border-b border-gray-50 pb-4">
                    <div className="flex justify-between">
                      <span className="text-[10px] font-black text-gray-800">{comment.user?.name || 'Anonymous'}</span>
                      <span className="text-[9px] text-gray-300">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
                
                {isFetchingNextPage && <CommentSkeleton />}
              </>
            )}
          </div>

          <div ref={ref} className="h-4" />
        </section>
      </div>
    </div>
  );
};

export default LpDetailPage;