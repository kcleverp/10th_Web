import { axiosInstance } from './axois';
import type {
  Comment,
  CommentListPayload,
  CommonResponse,
  Lp,
  LpListData,
  Like,
  RequestUpsertLp,
} from '../types/common';

function normalizeCreatedComment(payload: unknown): Comment {
  if (
    payload &&
    typeof payload === 'object' &&
    'status' in payload &&
    'data' in payload
  ) {
    return (payload as CommonResponse<Comment>).data;
  }
  return payload as Comment;
}

export const getLps = async (
  order: 'asc' | 'desc' = 'desc',
  cursor: number = 0,
  limit: number = 12
): Promise<LpListData> => {
  const { data } = await axiosInstance.get<CommonResponse<LpListData>>('/v1/lps', {
    params: { order, cursor, limit },
  });
  return data.data;
};

export const getLpDetail = async (lpId: number | string): Promise<Lp> => {
  const { data } = await axiosInstance.get<CommonResponse<Lp>>(`/v1/lps/${lpId}`);
  return data.data;
};

export const getLpComments = async (
  lpId: number | string,
  order: 'asc' | 'desc' = 'desc',
  cursor: number = 0,
  limit: number = 10
): Promise<CommentListPayload> => {
  const { data } = await axiosInstance.get<CommonResponse<CommentListPayload>>(
    `/v1/lps/${lpId}/comments`,
    {
      params: { order, cursor, limit },
    }
  );
  return data.data;
};

export const getMyLps = async (cursor: number = 0, limit: number = 10): Promise<LpListData> => {
  const { data } = await axiosInstance.get<CommonResponse<LpListData>>('/v1/lps/user', {
    params: { cursor, limit },
  });
  return data.data;
};

export const createLp = async (body: RequestUpsertLp): Promise<Lp> => {
  const { data } = await axiosInstance.post<CommonResponse<Lp>>('/v1/lps', body);
  return data.data;
};

export const updateLp = async (lpId: number, body: RequestUpsertLp): Promise<Lp> => {
  const { data } = await axiosInstance.patch<CommonResponse<Lp>>(`/v1/lps/${lpId}`, body);
  return data.data;
};

export const postComment = async (lpId: number, content: string): Promise<Comment> => {
  const { data } = await axiosInstance.post<unknown>(`/v1/lps/${lpId}/comments`, { content });
  return normalizeCreatedComment(data);
};

export const patchComment = async (
  lpId: number,
  commentId: number,
  content: string
): Promise<Comment> => {
  const { data } = await axiosInstance.patch<CommonResponse<Comment>>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data.data;
};

export const deleteComment = async (lpId: number, commentId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

export const likeLp = async (lpId: number): Promise<Like> => {
  const { data } = await axiosInstance.post<CommonResponse<Like>>(`/v1/lps/${lpId}/likes`);
  return data.data;
};

export const unlikeLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete<CommonResponse<null>>(`/v1/lps/${lpId}/likes`);
};

export const deleteLp = async (lpId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}`);
};
