import instance from "../helper/api.helper";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

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
    const response = await instance.get(`/fanpage-service/fanpages/get-page-id/${id}`, { responseType: 'arraybuffer' });
    return decryptArrayBuffer<any>(response.data, VITE_SECRET_KEY);
}

async function tokenRenewal(body: any) {
    const respone = await instance.post(`/fanpage-service/fanpages/token-renewal`, body);
    return respone.data
}

async function syncing(body: any) {
    const respone = await instance.post(`/fanpage-service/fanpages/syncing`, body);
    return respone.data
}
