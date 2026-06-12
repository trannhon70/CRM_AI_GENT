import instance from "../helper/api.helper";

export const userAPI = {
    login,
    loginV1,
    getByIdUser,
    logout
};

function login(data: any) {
    return instance.post("/users/login", data);
}

function loginV1(data: any) {
    return instance.post("/users/login-v1", data);
}

function getByIdUser() {
    return instance.get("/users/get-by-id-user");
}

function logout() {
    return instance.post("/users/logout");
}
