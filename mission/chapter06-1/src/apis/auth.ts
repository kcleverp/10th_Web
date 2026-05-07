
import { type RequestSignIn, type RequestSignUpUser, type ResponseSignIn, type ResponseSignUp} from "../types/authType"
import type { ResponseMyInfo } from '../types/authType';
import { axiosInstance } from './axois';


export const signup = async (body: RequestSignUpUser): Promise<ResponseSignUp> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);
    return data;
};

export const signin = async (body: RequestSignIn): Promise<ResponseSignIn> => {
    const { data } = await axiosInstance.post("/v1/auth/signin", body);
    return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfo> => {
    try {
        const response = await axiosInstance.get("/v1/users/me");

        if (!response || !response.data) {
            throw new Error("내 정보를 불러오는데 실패했습니다. (응답 데이터 없음)");
        }
        
        return response.data;
    } catch (error) {
        console.error("getMyInfo API 에러:", error);
        throw error; 
    }
}

export const postLogout = async() => {
    const {data} = await axiosInstance.post("/v1/auth/signout")
    return data 
}

