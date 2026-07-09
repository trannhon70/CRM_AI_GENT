import instance from "../helper/api.helper";

export const LiveMessageAPI = {
    getPaging,
    sendMessage
};

async function getPaging(query: any) {
    const respone = await instance.get(`/live-messages/get-paging?pageIndex=${query.pageIndex}&limit=${query.limit}&conversation_id=${query.conversation_id}&search=${query.search}`);
    return respone.data.data
}

async function sendMessage(body: any) {
    const respone = await instance.post(`/live-messages`, body);
    return respone.data.data
}