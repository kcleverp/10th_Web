import { axiosInstance } from './axois'; // 원본 파일명 유지
import type { CommonResponse, Lp, LpListData, Like } from '../types/common';

export const lpApi = {
  /**
   * LP 목록 조회 (무한 스크롤)
   */
  getLps: async (
    order: 'asc' | 'desc' = 'desc',
    cursor: number = 0,
    limit: number = 12 // 미션 요구사항에 맞게 기본값 조정 가능
  ): Promise<LpListData> => {
    const { data } = await axiosInstance.get<CommonResponse<LpListData>>('/v1/lps', {
      params: { order, cursor, limit },
    });
    return data.data;
  },

  /**
   * LP 상세 정보 조회
   */
  getLpDetail: async (lpId: number | string): Promise<Lp> => {
    const { data } = await axiosInstance.get<CommonResponse<Lp>>(`/v1/lps/${lpId}`);
    return data.data;
  },

  /**
   * LP 댓글 목록 조회 (미션 2 추가)
   */
  getLpComments: async (
    lpId: number | string,
    order: 'asc' | 'desc' = 'desc',
    cursor: number = 0,
    limit: number = 10
  ): Promise<LpListData> => {
    const { data } = await axiosInstance.get<CommonResponse<LpListData>>(`/v1/lps/${lpId}/comments`, {
      params: { order, cursor, limit },
    });
    return data.data;
  },

  /**
   * 내가 등록한 LP 목록 조회
   */
  getMyLps: async (
    cursor: number = 0,
    limit: number = 10
  ): Promise<LpListData> => {
    const { data } = await axiosInstance.get<CommonResponse<LpListData>>('/v1/lps/user', {
      params: { cursor, limit },
    });
    return data.data;
  },

  /**
   * LP 좋아요
   */
  likeLp: async (lpId: number): Promise<Like> => {
    const { data } = await axiosInstance.post<CommonResponse<Like>>(`/v1/lps/${lpId}/likes`);
    return data.data;
  },

  /**
   * LP 좋아요 취소
   */
  unlikeLp: async (lpId: number): Promise<void> => {
    await axiosInstance.delete<CommonResponse<null>>(`/v1/lps/${lpId}/likes`);
  },

  /**
   * LP 삭제
   */
  deleteLp: async (lpId: number): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}`);
  }
};

// 구조 분해 할당으로 내보내기
export const { 
  getLps, 
  getLpDetail, 
  getLpComments, // 새로 추가됨
  getMyLps, 
  likeLp, 
  unlikeLp, 
  deleteLp 
} = lpApi;