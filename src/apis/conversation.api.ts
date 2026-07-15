import instance from "../helper/api.helper";
import { isValidValue } from "../utils";

export const conversationAPI = {
    getAll,
    getById,
    updateName,
    getPaging,
    updateLabel,
    updateUnreadCount
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
    const params: Record<string, any> = {
        limit: query.limit ?? 20,
    };

    if (isValidValue(query.page_id)) {
        params.page_id = query.page_id;
    }

    if (isValidValue(query.lastId)) {
        params.lastId = Number(query.lastId);
    }

    if (isValidValue(query.lastUpdatedAt)) {
        params.lastUpdatedAt = Number(query.lastUpdatedAt);
    }

    if (isValidValue(query.search)) {
        params.search = query.search;
    }

    const response = await instance.get('/conversations/get-paging', { params });
    return response.data?.data;
}

async function updateLabel(body: any) {
    const response = await instance.post(`/conversations/update-label`, body);
    return response.data
}

async function updateUnreadCount(body: any) {
    const response = await instance.post(`/conversations/update-unread-count`, body);
    return response.data
}