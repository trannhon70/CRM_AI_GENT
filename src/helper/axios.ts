import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL_API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});