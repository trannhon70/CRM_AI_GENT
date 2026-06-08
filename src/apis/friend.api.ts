import instance from "../helper/api.helper";

export const friendAPI = {

    create,
    getAllById,
    getAllFriendUser
};

function create(data: any) {
    return instance.post("/friends/create", data);
}

async function getAllById(id: number) {
    const respone = await instance.get(`/friends/get-all-by-id/${id}`);
    return respone.data.data;
}

async function getAllFriendUser() {
    const respone = await instance.get(`/friends/get-all-friend-user`);
    return respone.data.data;
}

