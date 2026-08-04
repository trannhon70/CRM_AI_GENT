import instance from "../helper/api.helper";
import type { GetPagingQuickReplyCategoriesQuery } from "../types/quickReplyCategories";
import { isValidValue } from "../utils";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const quickReplyCategoriessAPI = {
    create,
    getPaging,
    isDelete,
    update,
    getAll
};



async function create(body: any) {
    const respone = await instance.post(`/chat-service/quick-reply-categories`, body);
    return respone.data.data
}


async function getPaging(query: GetPagingQuickReplyCategoriesQuery) {
    const params: Record<string, any> = {
        limit: query.limit ?? 20,
        pageIndex: query.pageIndex ?? 1,
    };

    if (isValidValue(query.page_id)) {
        params.page_id = query.page_id;
    }

    if (isValidValue(query.search)) {
        params.search = query.search;
    }
    const response = await instance.get(`/chat-service/quick-reply-categories/get-paging`, { params, responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}


async function isDelete(body: any) {
    const response = await instance.post(`/chat-service/quick-reply-categories/delete`, body);
    return response.data
}

async function update(body: any) {
    const response = await instance.put(`/chat-service/quick-reply-categories`, body);
    return response.data
}

async function getAll(query: any) {
    const params: Record<string, any> = {
        page_id: query.page_id
    };
    const response = await instance.get(`/chat-service/quick-reply-categories/get-all`, { params });
    return response.data
}