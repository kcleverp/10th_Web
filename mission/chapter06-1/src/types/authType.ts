import type { CommonResponse } from "./common";

// 1. 공통 유저 정보 인터페이스 (중복 제거)
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null; // avator -> avatar 오타 수정
  createdAt: string;
  updatedAt: string; // updatedAT -> updatedAt 오타 수정
}

// 2. 회원가입 관련 타입
export type RequestSignUpUser = {
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  password: string;
};

// UserInfo를 재사용하여 응답 타입 정의
export type ResponseSignUp = CommonResponse<UserInfo>;

// 3. 로그인 관련 타입
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

// 4. 내 정보 조회 응답 타입
export type ResponseMyInfo = CommonResponse<UserInfo>;