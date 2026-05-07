import { axiosInstance } from './axois'; 
import type { CommonResponse, Lp, LpListData, Like } from '../types/common';


export const lpApi = {

  getLps: async (
    order: 'asc' | 'desc' = 'desc',
    cursor: number = 0,
    limit: number = 10
  ): Promise<LpListData> => {
    const { data } = await axiosInstance.get<CommonResponse<LpListData>>('/v1/lps', {
      params: { order, cursor, limit },
    });
    return data.data;
  },


  getLpDetail: async (lpId: number): Promise<Lp> => {
    const { data } = await axiosInstance.get<CommonResponse<Lp>>(`/v1/lps/${lpId}`);
    return data.data;
  },

  getMyLps: async (
    cursor: number = 0,
    limit: number = 10
  ): Promise<LpListData> => {
    const { data } = await axiosInstance.get<CommonResponse<LpListData>>('/v1/lps/user', {
      params: { cursor, limit },
    });
    return data.data;
  },


  likeLp: async (lpId: number): Promise<Like> => {
    const { data } = await axiosInstance.post<CommonResponse<Like>>(`/v1/lps/${lpId}/likes`);
    return data.data;
  },

  unlikeLp: async (lpId: number): Promise<void> => {
    await axiosInstance.delete<CommonResponse<null>>(`/v1/lps/${lpId}/likes`);
  },


  deleteLp: async (lpId: number): Promise<void> => {
    await axiosInstance.delete(`/v1/lps/${lpId}`);
  }
};


export const { getLps, getLpDetail, getMyLps, likeLp, unlikeLp, deleteLp } = lpApi;