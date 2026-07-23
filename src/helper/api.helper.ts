import axios from "axios";
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { userAPI } from "../apis/user.api";
import { setAccessToken } from "../features/usersSlice";
import { store } from "../redux/store";

const apiUrl = import.meta.env.VITE_API_URL_API;
const instance: AxiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});
interface RetryRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let isRefreshing = false;
let isLoggingOut = false;

let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const INVALID_SESSION_MESSAGES = new Set([
    "Phiên đăng nhập không tồn tại hoặc đã bị đăng xuất",
    "Refresh token không hợp lệ hoặc đã hết hạn",
    "Refresh token đã bị thu hồi",
    "Tài khoản đã đăng nhập nơi khác",
]);

const processQueue = (error?: any, token?: string) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) reject(error);
        else resolve(token!);
    });
    failedQueue = [];
};

const logout = () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    localStorage.clear();
    window.location.replace("/login");
};

instance.interceptors.request.use((config) => {
    const { access_token } = store.getState().users;
    console.log(access_token, 'access_token');

    if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<any>) => {
        const originalRequest = error.config as RetryRequest;
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // mất internet
        if (!error.response) {
            return Promise.reject(error);
        }

        // refresh token invalid
        if (INVALID_SESSION_MESSAGES.has(message)) {
            logout();
            return Promise.reject(error);
        }

        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await userAPI.refresh();
            store.dispatch(setAccessToken(data.access_token));
            processQueue(undefined, data.access_token);
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return instance(originalRequest);
        } catch (err) {
            processQueue(err);
            logout();
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

export default instance;