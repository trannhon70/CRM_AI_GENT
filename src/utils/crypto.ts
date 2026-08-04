// utils/crypto.ts
import CryptoJS from 'crypto-js';
import * as pako from 'pako';

/**
 * Giải mã response dạng ArrayBuffer đã qua gzip + AES encrypt từ backend.
 * Thứ tự backend xử lý: JSON -> gzip -> AES encrypt -> Buffer(IV + encrypted)
 * Thứ tự frontend xử lý (ngược lại): decrypt -> gunzip -> JSON.parse
 */
export function decryptArrayBuffer<T = any>(arrayBuffer: ArrayBuffer, secretKey: string): T {
    try {
        const buffer = new Uint8Array(arrayBuffer);
        const iv = CryptoJS.lib.WordArray.create(buffer.slice(0, 16));
        const encryptedData = CryptoJS.lib.WordArray.create(buffer.slice(16));
        const key = CryptoJS.SHA256(secretKey);

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encryptedData } as any,
            key,
            { iv, mode: CryptoJS.mode.CBC }
        );

        const decryptedBytes = wordArrayToUint8Array(decrypted);
        const decompressed = pako.ungzip(decryptedBytes);
        const jsonStr = new TextDecoder('utf-8').decode(decompressed);

        return JSON.parse(jsonStr) as T;
    } catch (error) {
        console.error('Failed to decrypt response:', error);
        throw new Error('Không thể giải mã dữ liệu từ server');
    }
}

function wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const { words, sigBytes } = wordArray;
    const result = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
        result[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return result;
}