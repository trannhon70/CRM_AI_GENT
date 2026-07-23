import instance from "../helper/api.helper";
import { api } from "../helper/axios";

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

function getByIdUser() {
    return instance.get("/auth-service/users/get-by-id-user");
}

function logout() {
    return instance.post("/auth-service/users/logout");
}

function refresh() {
    return api.post("/auth-service/users/refresh");
}
