import instance from "../helper/api.helper";
import { api } from "../helper/axios";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const userAPI = {
    login,
    loginV1,
    getByIdUser,
    logout,
    refresh
};

function login(data: any) {
    return instance.post("/auth-service/users/login", data);
}

function loginV1(data: any) {
    return instance.post("/auth-service/users/login-v1", data);
}

async function getByIdUser() {
    const response = await instance.get("/auth-service/users/get-by-id-user", { responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}

function logout() {
    return instance.post("/auth-service/users/logout");
}

function refresh() {
    return api.post("/auth-service/users/refresh");
}
