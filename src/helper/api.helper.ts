import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { userAPI } from "../apis/user.api";
import { setAccessToken } from "../features/usersSlice";
import { store } from "../redux/store";
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
        const message = error.response?.data?.message;
        if (message === "Phiên đăng nhập không tồn tại hoặc đã bị đăng xuất" || message === "Refresh token không hợp lệ hoặc đã hết hạn" || message === "Tài khoản đã đăng nhập nơi khác" || message === "Refresh token đã bị thu hồi") {
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
        }
        console.log(error.response, 'error');
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

                console.log(err, 'err');

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