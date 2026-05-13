import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import {
  deleteLp,
  deleteComment,
  getLpComments,
  getLpDetail,
  likeLp,
  patchComment,
  postComment,
  unlikeLp,
} from '../apis/lpApi';
import type { Lp } from '../types/common';

const useLpDetail = (lpId: number) => {
  return useQuery<Lp>({
    queryKey: ['lps', 'detail', lpId],
    queryFn: () => getLpDetail(lpId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!lpId && !isNaN(lpId),
  });
};

export function useLpComments(lpId: string | undefined, order: 'asc' | 'desc') {
  const { ref, inView } = useInView();
  const {
    data: commentData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isCommentsLoading,
  } = useInfiniteQuery({
    queryKey: ['lpComments', lpId, order],
    queryFn: ({ pageParam = 0 }) =>
      getLpComments(Number(lpId), order, pageParam as number),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
    enabled: !!lpId,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allComments = commentData?.pages.flatMap((page) => page.data) ?? [];

  return {
    ref,
    allComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isCommentsLoading,
  };
}

export type UseLpDetailMutationsArgs = {
  lpId: string | undefined;
  lp: Lp | undefined;
  likedByMe: boolean;
  refetchLp: () => void;
  commentText: string;
  setCommentText: Dispatch<SetStateAction<string>>;
  setCommentErr: Dispatch<SetStateAction<string | null>>;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  setMenuOpenId: Dispatch<SetStateAction<number | null>>;
};

export function useLpDetailMutations({
  lpId,
  lp,
  likedByMe,
  refetchLp,
  commentText,
  setCommentText,
  setCommentErr,
  setEditingId,
  setMenuOpenId,
}: UseLpDetailMutationsArgs) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const invalidateComments = () => {
    queryClient.invalidateQueries({ queryKey: ['lpComments', lpId] });
  };

  const postCommentMut = useMutation({
    mutationFn: async () => {
      if (!commentText.trim()) throw new Error('내용을 입력해주세요.');
      await postComment(Number(lpId), commentText.trim());
    },
    onSuccess: () => {
      setCommentText('');
      setCommentErr(null);
      invalidateComments();
    },
    onError: () => setCommentErr('등록에 실패했습니다.'),
  });

  const patchCommentMut = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) =>
      patchComment(Number(lpId), id, content),
    onSuccess: () => {
      setEditingId(null);
      invalidateComments();
    },
  });

  const deleteCommentMut = useMutation({
    mutationFn: (commentId: number) => deleteComment(Number(lpId), commentId),
    onSuccess: () => {
      setMenuOpenId(null);
      invalidateComments();
    },
  });

  const deleteLpMut = useMutation({
    mutationFn: () => {
      if (!lp) throw new Error('LP 없음');
      return deleteLp(Number(lp.id));
    },
    onSuccess: async () => {
      if (!lp) return;
      const id = Number(lp.id);
      await queryClient.invalidateQueries({ queryKey: ['lps'] });
      queryClient.removeQueries({ queryKey: ['lps', 'detail', id] });
      queryClient.removeQueries({ queryKey: ['lpComments', lpId] });
      navigate('/');
    },
  });

  const likeMut = useMutation({
    mutationFn: async () => {
      if (!lp) return;
      if (likedByMe) await unlikeLp(lp.id);
      else await likeLp(lp.id);
    },
    onSuccess: () => refetchLp(),
  });

  return {
    postCommentMut,
    patchCommentMut,
    deleteCommentMut,
    deleteLpMut,
    likeMut,
  };
}

export default useLpDetail;
