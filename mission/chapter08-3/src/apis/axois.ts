import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SEVER_API_URL,
});


axiosInstance.interceptors.request.use(
    (config) => {

        const tokenRaw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        const accessToken = tokenRaw ? tokenRaw.replace(/^"(.*)"$/, '$1') : null;

        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url === "/v1/auth/refresh") {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const rfTokenRaw = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                    const refreshToken = rfTokenRaw ? rfTokenRaw.replace(/^"(.*)"$/, '$1') : null;

                    const { data } = await axiosInstance.post("/v1/auth/refresh", {
                        refresh: refreshToken
                    });

                    const newAccessToken = data.data.accessToken;
                    const newRefreshToken = data.data.refreshToken;

          
                    localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(newAccessToken));
                    localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(newRefreshToken));

                    return newAccessToken;
                })()
                .catch((refreshError) => {
                    localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                    localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                    window.location.href = "/login";
                    return Promise.reject(refreshError);
                })
                .finally(() => {
                    refreshPromise = null;
                });
            }

            return refreshPromise.then((newAccessToken) => {
                if (originalRequest.headers) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                }
                return axiosInstance.request(originalRequest);
            });
        }


        return Promise.reject(error);
    }
);