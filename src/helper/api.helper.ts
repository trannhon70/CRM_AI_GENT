import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { setAccessToken } from "../features/usersSlice";
import { userAPI } from "../apis/user.api";
const apiUrl = import.meta.env.VITE_API_URL_API;

const instance = axios.create({

    baseURL: apiUrl,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', "ngrok-skip-browser-warning": "true", },
});

// Interceptor cho request
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const { access_token } = store.getState().users;
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }

        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

// Interceptor cho response
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token as string);
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Đang có 1 request khác refresh rồi → xếp hàng đợi, không gọi refresh thêm
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return instance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refresh = await userAPI.refresh();
                const accessToken = refresh.data.access_token;

                store.dispatch(setAccessToken(accessToken));
                processQueue(null, accessToken); // giải phóng các request đang đợi

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return instance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
export default instance;