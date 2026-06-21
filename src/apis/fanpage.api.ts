import instance from "../helper/api.helper";

export const fanPagesAPI = {
    createConnectPageFacebook,
    getPagesId
};

async function createConnectPageFacebook(body: any) {
    const respone = await instance.post("/fanpages/connect-page-facebook", body);
    return respone.data
}

async function getPagesId(id: any) {
    const respone = await instance.get(`/fanpages/get-page-id/${id}`);
    return respone.data
}