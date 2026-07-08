import instance from "../helper/api.helper";

export const LiveMessageAPI = {
    getPaging
};

async function getPaging(query: any) {
    const respone = await instance.get(`/live-messages/get-paging?pageIndex=${query.pageIndex}&limit=${query.limit}&conversation_id=${query.conversation_id}&search=${query.search}`);
    return respone.data.data
}