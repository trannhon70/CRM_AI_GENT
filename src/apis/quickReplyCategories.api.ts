import instance from "../helper/api.helper";

export const quickReplyCategoriessAPI = {
    create,
};



async function create(body: any) {
    const respone = await instance.post(`/chat-service/quick-reply-categories`, body);
    return respone.data.data
}

