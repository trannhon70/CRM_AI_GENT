import instance from "../helper/api.helper";

export const fanPagesAPI = {
    createConnectPageFacebook,
    getPagesId,
    tokenRenewal,
    syncing
};

async function createConnectPageFacebook(body: any) {
    const respone = await instance.post("/fanpage-service/fanpages/connect-page-facebook", body);
    return respone.data
}

async function getPagesId(id: any) {
    const respone = await instance.get(`/fanpage-service/fanpages/get-page-id/${id}`);
    return respone
}

async function tokenRenewal(body: any) {
    const respone = await instance.post(`/fanpage-service/fanpages/token-renewal`, body);
    return respone.data
}

async function syncing(body: any) {
    const respone = await instance.post(`/fanpage-service/fanpages/syncing`, body);
    return respone.data
}
