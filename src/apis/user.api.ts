import instance from "../helper/api.helper";

export const userAPI = {
    login,
    loginGoogle
};

function login(data: any) {
    return instance.post("/users/login", data);
}

function loginGoogle(data: any) {
    return instance.post("/users/login-google", data);
}


