import type { CommonResponse } from "./common";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export type RequestSignUpUser = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};

export type ResponseSignUp = CommonResponse<UserInfo>;

export type RequestSignIn = {
  email: string;
  password: string;
};

export type ResponseSignIn = CommonResponse<{
  email: string;
  nickname: string;
  id: number;
  name: string;
  accessToken: string;
  refreshToken: string;
}>;

export type ResponseMyInfo = CommonResponse<UserInfo>;

export type RequestPatchUser = {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
};