import instance from "../helper/api.helper";
import type { GetPagingLabelQuery } from "../types/label";
import { isValidValue } from "../utils";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const labelAPI = {
    getPaging,
    isDelete,
    create,
    update,
    restore
};

async function getPaging(query: GetPagingLabelQuery) {
    const params: Record<string, any> = {
        limit: query.limit ?? 20,
        pageIndex: query.pageIndex ?? 1,
    };

    if (isValidValue(query.page_id)) {
        params.page_id = query.page_id;
    }

    if (isValidValue(query.is_deleted)) {
        params.is_deleted = query.is_deleted;
    }

    if (isValidValue(query.search)) {
        params.search = query.search;
    }
    const response = await instance.get(`/chat-service/labels/get-paging`, { params, responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}

async function isDelete(id: number) {
    const response = await instance.delete(`/chat-service/labels/${id}`);
    return response.data
}

async function create(body: any) {
    const response = await instance.post(`/chat-service/labels`, body);
    return response.data
}

async function update(body: any) {
    const response = await instance.put(`/chat-service/labels`, body);
    return response.data
}

async function restore(id: number) {
    const response = await instance.put(`/chat-service/labels/restore/${id}`);
    return response.data
}