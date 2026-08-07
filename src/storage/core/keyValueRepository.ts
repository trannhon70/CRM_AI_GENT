// core/keyValueRepository.ts
import { db } from "./db";
import { STORE } from "./stores";

export class KeyValueRepository {
    protected readonly store: string;

    constructor(store: string) {
        this.store = store;
    }

    async set<T>(key: string, value: T) {
        return (await db).put(this.store, { key, value } as never);
    }

    async get<T>(key: string): Promise<T | undefined> {
        const result = await (await db).get(this.store, key);
        return result?.value as T | undefined;
    }
}

export const cacheRepository = new KeyValueRepository(STORE.CACHE);