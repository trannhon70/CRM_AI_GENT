import instance from "../helper/api.helper";
import { isValidValue } from "../utils";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const conversationAPI = {
    getAll,
    getById,
    updateName,
    getPaging,
    updateLabel,
    updateUnreadCount
};

async function getAll(query: any) {
    const respone = await instance.get(`/chat-service/conversation/get-all?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}`);
    return respone.data.data
}

async function getById(id: number) {
    const respone = await instance.get(`/chat-service/conversation/get-by-id/${id}`);
    return respone.data
}

async function updateName(id: number, body: any) {
    const respone = await instance.put(`/chat-service/conversation/update-name/${id}`, body);
    return respone.data
}

async function getPaging(query: any) {
    const params: Record<string, any> = {
        limit: query.limit ?? 20,
    };

    if (isValidValue(query.page_id)) {
        params.page_id = query.page_id;
    }

    if (isValidValue(query.pageIndex)) {
        params.pageIndex = Number(query.pageIndex);
    }

    if (isValidValue(query.search)) {
        params.search = query.search;
    }

    const response = await instance.get(`/chat-service/conversation/get-paging`, { params, responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}

async function updateLabel(body: any) {
    const response = await instance.post(`/chat-service/conversation/update-label`, body);
    return response.data
}

async function updateUnreadCount(body: any) {
    const response = await instance.post(`/chat-service/conversation/update-unread-count`, body);
    return response.data
}