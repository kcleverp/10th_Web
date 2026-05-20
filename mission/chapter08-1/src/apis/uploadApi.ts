import { axiosInstance } from './axois';
import type { CommonResponse } from '../types/common';

type UploadResponseData = {
  imageUrl: string;
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosInstance.post<CommonResponse<UploadResponseData>>('/v1/uploads', formData);
  return data.data.imageUrl;
}
