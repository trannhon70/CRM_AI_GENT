import instance from "../helper/api.helper";

export const userAPI = {
    login
};

function login(data: any) {
    return instance.post("/users/login", data);
}


