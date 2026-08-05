import instance from "../helper/api.helper";
import { isValidValue } from "../utils";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const LiveMessageAPI = {
    getPaging,
    sendMessage,
};

async function getPaging(query: any) {
    const params: Record<string, any> = {
        limit: query.limit ?? 20,
        pageIndex: query.pageIndex ?? 1,
    };

    if (isValidValue(query.conversation_id)) {
        params.conversation_id = query.conversation_id;
    }

    if (isValidValue(query.search)) {
        params.search = query.search;
    }
    const response = await instance.get(`/chat-service/messages/get-paging`, { params, responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}


async function sendMessage(body: any) {
    const respone = await instance.post(`/chat-service/messages`, body);
    return respone.data.data
}

