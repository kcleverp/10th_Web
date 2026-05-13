import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import useLpDetail, {
  useLpComments,
  useLpDetailMutations,
} from '../hooks/useLpDetail';
import { useAuth } from '../context/AuthContext';
import CommentSkeleton from '../component/CommentSkeleton';
import { useLpModalOutlet } from '../context/LpModalOutletContext';
import type { Comment } from '../types/common';

const eqId = (a: unknown, b: unknown) =>
  a != null && b != null && Number(a) === Number(b);

const LpDetailPage = () => {
  const { lpId } = useParams();
  const navigate = useNavigate();
  const outletCtx = useLpModalOutlet();
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const order = (searchParams.get('order') as 'desc' | 'asc') || 'desc';

  const setOrder = (newOrder: 'desc' | 'asc') => {
    setSearchParams({ order: newOrder });
  };

  const { data: lp, isLoading, isError, refetch } = useLpDetail(Number(lpId));

  const { ref, allComments, isFetchingNextPage, isCommentsLoading } =
    useLpComments(lpId, order);

  const isOwner = useMemo(() => {
    if (!user || !lp) return false;
    const ownerId = lp.author?.id ?? lp.authorId;
    return eqId(user.id, ownerId);
  }, [user, lp]);

  const likedByMe = useMemo(() => {
    if (!user || !lp) return false;
    return lp.likes.some((l) => eqId(l.userId, user.id));
  }, [user, lp]);

  const [commentText, setCommentText] = useState('');
  const [commentErr, setCommentErr] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const { postCommentMut, patchCommentMut, deleteCommentMut, deleteLpMut, likeMut } =
    useLpDetailMutations({
      lpId,
      lp,
      userId: user?.id,
      refetchLp: refetch,
      commentText,
      setCommentText,
      setCommentErr,
      setEditingId,
      setMenuOpenId,
    });

  const startEdit = (c: Comment) => {
    setEditingId(c.id);
    setEditingContent(c.content);
    setMenuOpenId(null);
  };

  const canManageComment = (c: Comment) =>
    !!user && (eqId(c.authorId, user.id) || eqId(c.author?.id, user.id));

  if (isLoading) return <div className="py-20 text-center text-gray-400 animate-pulse">LOADING...</div>;
  if (isError || !lp) return <div className="py-20 text-center text-gray-400">RECORD NOT FOUND.</div>;

  return (
    <div className="flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-[400px] flex flex-col gap-6">
        <div className="flex justify-between items-end border-b pb-4">
          <h1 className="text-2xl font-black tracking-tighter">{lp.title}</h1>
          {isOwner && (
            <div className="flex gap-2 mb-1">
              <button
                type="button"
                onClick={() => outletCtx?.openLpModalEdit(lp)}
                className="text-[10px] text-gray-400 underline"
              >
                EDIT
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('삭제하시겠습니까?')) deleteLpMut.mutate();
                }}
                disabled={deleteLpMut.isPending}
                className="text-[10px] text-gray-400 underline disabled:opacity-50"
              >
                DELETE
              </button>
            </div>
          )}
        </div>

        <img
          src={lp.thumbnail || 'https://via.placeholder.com/600'}
          className="w-full aspect-square object-cover border"
          alt="thumbnail"
        />

        <div className="flex flex-col gap-2">
          {lp.artist != null && lp.artist !== '' && (
            <p className="text-sm text-gray-800 font-bold">{lp.artist}</p>
          )}
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{lp.content}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {lp.tags.map((tag) => (
            <span key={tag.id} className="text-[10px] text-[#807bff] font-bold">
              #{tag.name}
            </span>
          ))}
        </div>

        <button
          type="button"
          disabled={likeMut.isPending}
          onClick={() => {
            if (!user) return navigate('/login');
            likeMut.mutate({ willLike: !likedByMe });
          }}
          className="w-full bg-[#807bff] text-white py-4 font-black tracking-widest hover:bg-black transition-colors disabled:opacity-60"
        >
          {likedByMe ? 'UNLIKE' : 'LIKE'} ({lp.likes.length})
        </button>

        <div className="h-[2px] bg-gray-50 my-8" />

        <section className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Comment</h3>
          <div className="flex flex-col gap-2">
            <textarea
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value);
                setCommentErr(null);
              }}
              className="w-full h-20 p-3 border border-gray-100 text-xs outline-none focus:border-[#807bff] transition-colors resize-none"
              placeholder="음악에 대한 의견을 남겨주세요."
              disabled={!user}
            />
            <div className="flex justify-between items-center">
              <span className="text-[9px] text-red-400 font-bold italic">
                {!user ? '로그인 후 작성 가능합니다.' : commentErr || (!commentText.trim() ? '내용을 입력해주세요.' : '')}
              </span>
              <button
                type="button"
                disabled={!user || postCommentMut.isPending}
                onClick={() => postCommentMut.mutate()}
                className="px-6 py-2 bg-black text-white text-[10px] font-black tracking-widest disabled:bg-gray-300"
              >
                POST
              </button>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6 mt-8">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[10px] font-black tracking-widest text-gray-400">
              ARCHIVE ({allComments.length})
            </span>
            <div className="flex gap-4 text-[9px] font-black">
              <button type="button" onClick={() => setOrder('desc')} className={order === 'desc' ? 'text-[#807bff]' : 'text-gray-300'}>
                LATEST
              </button>
              <button type="button" onClick={() => setOrder('asc')} className={order === 'asc' ? 'text-[#807bff]' : 'text-gray-300'}>
                OLDEST
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {isCommentsLoading ? (
              <>
                <CommentSkeleton key="comment-skel-0" />
                <CommentSkeleton key="comment-skel-1" />
                <CommentSkeleton key="comment-skel-2" />
              </>
            ) : (
              <>
                {allComments.map((comment: Comment) => (
                  <div key={comment.id} className="flex flex-col gap-1 border-b border-gray-50 pb-4 relative">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-black text-gray-800">
                        {comment.author?.name ?? 'Anonymous'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] text-gray-300">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {canManageComment(comment) && editingId !== comment.id && (
                          <div className="relative">
                            <button
                              type="button"
                              className="text-gray-400 hover:text-black px-1 text-sm"
                              aria-label="메뉴"
                              onClick={() => setMenuOpenId(menuOpenId === comment.id ? null : comment.id)}
                            >
                              ⋯
                            </button>
                            {menuOpenId === comment.id && (
                              <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-[#eee] shadow-md rounded-sm py-1 min-w-[88px] flex flex-col">
                                <button
                                  type="button"
                                  className="text-left px-3 py-2 text-[10px] hover:bg-[#f8f8ff]"
                                  onClick={() => startEdit(comment)}
                                >
                                  수정
                                </button>
                                <button
                                  type="button"
                                  className="text-left px-3 py-2 text-[10px] text-red-500 hover:bg-[#fff5f5]"
                                  onClick={() => {
                                    if (confirm('댓글을 삭제할까요?')) deleteCommentMut.mutate(comment.id);
                                  }}
                                >
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {editingId === comment.id ? (
                      <div className="flex flex-col gap-2 mt-1">
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          className="w-full min-h-[60px] p-2 border border-gray-100 text-xs outline-none focus:border-[#807bff]"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            className="px-3 py-1 border border-[#ccc] text-[10px] font-black"
                            onClick={() => setEditingId(null)}
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            disabled={patchCommentMut.isPending}
                            className="px-3 py-1 bg-black text-white text-[10px] font-black disabled:opacity-50"
                            onClick={() => {
                              const t = editingContent.trim();
                              if (!t) return;
                              patchCommentMut.mutate({ id: comment.id, content: t });
                            }}
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-600 leading-relaxed">{comment.content}</p>
                    )}
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
