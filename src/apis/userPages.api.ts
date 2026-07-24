import instance from "../helper/api.helper";
import type { GetPagingUserPageQuery } from "../types/userPage";

export const userPagesAPI = {
    getpaging,
    getCountProvider,
    deleteUserPage,
    createUserPage,
    getPagingUserPageActive
};

async function getpaging(query: any) {
    const respone = await instance.get(`/fanpage-service/user-pages/get-paging?pageIndex=${query.pageIndex}&limit=${query.limit}&search=${query.search}&provider=${query.provider}`);
    return respone.data.data
}

async function getCountProvider() {
    const respone = await instance.get(`/fanpage-service/user-pages/get-count-provider`);
    return respone.data.data
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
    const respone = await instance.get(`/fanpage-service/user-pages/get-paging-user-page-active?pageIndex=${query.pageIndex}&limit=${query.limit}&search=${query.search}&page_id=${query.page_id}`);
    return respone.data
}