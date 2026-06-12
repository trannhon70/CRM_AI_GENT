import instance from "../helper/api.helper";

export const userAPI = {
    login,
    loginV1,
};

function login(data: any) {
    return instance.post("/users/login", data);
}

function loginV1(data: any) {
    return instance.post("/users/login-v1", data);
}



