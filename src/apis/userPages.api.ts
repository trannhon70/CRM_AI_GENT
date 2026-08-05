import instance from "../helper/api.helper";
import type { GetPagingUserPageQuery } from "../types/userPage";
import { isValidValue } from "../utils";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const userPagesAPI = {
    getpaging,
    getCountProvider,
    deleteUserPage,
    createUserPage,
    getPagingUserPageActive
};

async function getpaging(query: any) {
    const params: Record<string, any> = {
        limit: query.limit ?? 20,
        pageIndex: query.pageIndex ?? 1,
    };

    if (isValidValue(query.search)) {
        params.search = query.search;
    }

    if (isValidValue(query.provider)) {
        params.provider = query.provider;
    }
    const response = await instance.get(`/fanpage-service/user-pages/get-paging`, { params, responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}

async function getCountProvider() {
    const response = await instance.get(`/fanpage-service/user-pages/get-count-provider`, { responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}

async function deleteUserPage(id: number) {
    const respone = await instance.delete(`/fanpage-service/user-pages/delete/${id}`);
    return respone.data.data
}

async function createUserPage(body: any) {
    const respone = await instance.post(`/fanpage-service/user-pages/create`, body);
    return respone.data.data
}

async function getPagingUserPageActive(query: GetPagingUserPageQuery) {
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
    const response = await instance.get(`/fanpage-service/user-pages/get-paging-user-page-active`, { params, responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}