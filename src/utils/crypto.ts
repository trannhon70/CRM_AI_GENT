// utils/crypto.ts
import CryptoJS from 'crypto-js';
import * as pako from 'pako';
import { decode } from '@msgpack/msgpack';

/**
 * Format buffer: [1 byte flags][16 bytes IV][ciphertext]
 * flags bit 0: 1 = có nén deflateRaw, 0 = không nén
 * Thứ tự backend: msgpack encode -> (deflateRaw nếu > ngưỡng) -> AES-CTR encrypt -> [flags][IV][ciphertext]
 * Thứ tự frontend (ngược lại): decrypt -> (inflateRaw nếu flag bật) -> msgpack decode
 */
export function decryptArrayBuffer<T = any>(arrayBuffer: ArrayBuffer, secretKey: string): T {
    try {
        const buffer = new Uint8Array(arrayBuffer);
        const flags = buffer[0];
        const isCompressed = (flags & 1) === 1;

        const iv = CryptoJS.lib.WordArray.create(buffer.slice(1, 17) as any);
        const encryptedData = CryptoJS.lib.WordArray.create(buffer.slice(17) as any);
        const key = CryptoJS.SHA256(secretKey);

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: encryptedData } as any,
            key,
            { iv, mode: CryptoJS.mode.CTR, padding: CryptoJS.pad.NoPadding }
        );

        let decryptedBytes = wordArrayToUint8Array(decrypted);

        if (isCompressed) {
            decryptedBytes = pako.inflateRaw(decryptedBytes);
        }

        return decode(decryptedBytes) as T;
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