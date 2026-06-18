import instance from "../helper/api.helper";

export const fanPagesAPI = {
    create,
    getPagesId
};

async function create(body: any) {
    const respone = await instance.post("/fanpages", body);
    return respone.data
}

async function getPagesId(id: any) {
    const respone = await instance.get(`/fanpages/get-page-id/${id}`);
    return respone.data
}