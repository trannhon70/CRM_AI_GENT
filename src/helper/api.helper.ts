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

let isLoggingOut = false;

const INVALID_SESSION_MESSAGES = new Set([
    "Phiên đăng nhập không tồn tại hoặc đã bị đăng xuất",
    "Refresh token không hợp lệ hoặc đã hết hạn",
    "Refresh token đã bị thu hồi",
    "Tài khoản đã đăng nhập nơi khác",
]);

const logout = () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    localStorage.clear();
    window.location.replace("/login");
};

// Các endpoint không cần chờ refresh / không cần gắn token
const SKIP_URLS = [
    "/auth-service/users/login",
    "/auth-service/users/login-v1",
    "/auth-service/users/refresh",
];

let refreshPromise: Promise<string> | null = null;
let hasBootstrapped = false;

const refreshAccessToken = async (): Promise<string> => {
    if (refreshPromise) return refreshPromise; // dedupe nếu đang refresh sẵn

    refreshPromise = (async () => {
        try {
            const { data } = await userAPI.refresh();
            store.dispatch(setAccessToken(data.access_token));
            return data.access_token as string;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

instance.interceptors.request.use(async (config) => {
    const shouldSkip = SKIP_URLS.some((u) => config.url?.includes(u));

    if (!shouldSkip) {
        if (refreshPromise) {
            await refreshPromise;
        } else if (!hasBootstrapped) {
            hasBootstrapped = true;
            const { access_token } = store.getState().users;
            if (!access_token) {  // chỉ bootstrap khi CHƯA có access token
                try {
                    await refreshAccessToken();
                } catch { }
            }
        }
    }

    const { access_token } = store.getState().users;
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

        // refresh token invalid / phiên bị thu hồi
        if (INVALID_SESSION_MESSAGES.has(message)) {
            logout();
            return Promise.reject(error);
        }

        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newToken = await refreshAccessToken(); // tự dedupe nếu nhiều request 401 cùng lúc
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance(originalRequest);
        } catch (err) {
            logout();
            return Promise.reject(err);
        }
    }
);

export default instance;