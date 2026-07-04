import instance from "../helper/api.helper";

export const conversationAPI = {
    getAll,
    getById,
    updateName,
    getPaging,
    updateLabel
};

async function getAll(query: any) {
    const respone = await instance.get(`/conversations/get-all?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`);
    return respone.data.data
}

async function getById(id: number) {
    const respone = await instance.get(`/conversations/get-by-id/${id}`);
    return respone.data
}

async function updateName(id: number, body: any) {
    const respone = await instance.put(`/conversations/update-name/${id}`, body);
    return respone.data
}

async function getPaging(query: any) {
    const respone = await instance.get(`/conversations/get-paging?lastId=${query.lastId}&lastUpdatedAt=${query.lastUpdatedAt}&limit=${query.limit}&page_id=${query.page_id}&search=${query.search}`);
    return respone.data.data
}

async function updateLabel(body: any) {
    const response = await instance.post(`/conversations/update-label`, body);
    return response.data
}