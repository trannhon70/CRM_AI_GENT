import instance from "../helper/api.helper";
import type { GetPagingQuickReplyCategoriesQuery } from "../types/quickReplyCategories";
import { isValidValue } from "../utils";

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
    const respone = await instance.get(`/chat-service/quick-reply-categories/get-paging`, { params });
    return respone.data
}


async function isDelete(id: number) {
    const respone = await instance.delete(`/chat-service/quick-reply-categories/${id}`);
    return respone.data
}

async function update(body: any) {
    const response = await instance.put(`/chat-service/quick-reply-categories`, body);
    return response.data
}

async function getAll(query: any) {
    const params: Record<string, any> = {
        page_id: query.page_id
    };
    const respone = await instance.get(`/chat-service/quick-reply-categories/get-all`, { params });
    return respone.data
}