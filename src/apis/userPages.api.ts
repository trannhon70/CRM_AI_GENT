import instance from "../helper/api.helper";

export const userPagesAPI = {
    getpaging,

};

async function getpaging(query: any) {
    console.log(query);

    const respone = await instance.get(`/user-pages/get-paging?pageIndex=${query.pageIndex}&pageSize=${query.pageSize}&search=${query.search}&provider=${query.provider}`);
    return respone.data.data
}