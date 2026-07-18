import instance from "../helper/api.helper";
import type { GetPagingLabelQuery } from "../types/label";

export const labelAPI = {
    getPaging,
    isDelete
};

async function getPaging(query: GetPagingLabelQuery) {
    const respone = await instance.get(`/labels/get-paging?pageIndex=${query.pageIndex}&limit=${query.limit}&search=${query.search}&page_id=${query.page_id}&is_deleted=${query.is_deleted}`);
    return respone.data
}

async function isDelete(id: number) {
    const response = await instance.delete(`/labels/${id}`);
    return response.data
}