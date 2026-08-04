import instance from "../helper/api.helper";
import { isValidValue } from "../utils";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
import { decryptArrayBuffer } from "../utils/crypto";

export const quickReplyAPI = {
    create,
    getPaging,
    isDelete,
    update,
};

async function create(body: any) {
    const respone = await instance.post(`/chat-service/quick-reply`, body);
    return respone.data.data
}

async function getPaging(query: any) {
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

    const res = await instance.get(`/chat-service/quick-reply/get-paging`, { params, responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(res.data, VITE_SECRET_KEY);
}

async function isDelete(id: number) {
    const respone = await instance.delete(`/chat-service/quick-reply/${id}`);
    return respone.data
}

async function update(body: any) {
    const response = await instance.put(`/chat-service/quick-reply`, body);
    return response.data.data
}

