import instance from "../helper/api.helper";

export const userPagesAPI = {
    getpaging,
    getCountProvider
};

async function getpaging(query: any) {
    const respone = await instance.get(`/user-pages/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&search=${query.search}&provider=${query.provider}`);
    return respone.data.data
}

async function getCountProvider() {
    const respone = await instance.get(`/user-pages/get-count-provider`);
    return respone.data.data
}