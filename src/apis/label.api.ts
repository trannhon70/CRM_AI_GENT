import instance from "../helper/api.helper";
import type { GetPagingLabelQuery } from "../types/label";
import { isValidValue } from "../utils";

export const labelAPI = {
    getPaging,
    isDelete,
    create
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
    const respone = await instance.get(`/labels/get-paging`, { params });
    return respone.data
}

async function isDelete(id: number) {
    const response = await instance.delete(`/labels/${id}`);
    return response.data
}

async function create(body: any) {
    const response = await instance.post(`/labels`, body);
    return response.data
}