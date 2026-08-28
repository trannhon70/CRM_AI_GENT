import instance from "../helper/api.helper";
import { decryptArrayBuffer } from "../utils/crypto";
const VITE_SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export const telegramAPI = {

    createQr,
    getQrStatus
};



async function createQr(body: any) {
    const respone = await instance.post("/fanpage-service/telegram/qr", body);
    return respone.data
}

async function getQrStatus(sessionId: string) {
    const respone = await instance.get(`/fanpage-service/telegram/qr-status/${sessionId}`);
    return respone.data
}