import { db } from "./db";

export interface PagingResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}

export class Repository<T> {
    protected readonly store: string;

    constructor(store: string) {
        this.store = store;
    }

    async create(data: T) {
        return (await db).add(this.store, data as never);
    }

    async put(data: T) {
        return (await db).put(this.store, data as never);
    }

    async putMany(items: T[]) {
        const database = await db;
        const tx = database.transaction(this.store, "readwrite");
        await Promise.all([
            ...items.map((item) => tx.store.put(item as never)),
            tx.done,
        ]);
    }

    async get(id: IDBValidKey) {
        return (await db).get(this.store, id) as Promise<T | undefined>;
    }

    async getAll() {
        return (await db).getAll(this.store) as Promise<T[]>;
    }

    async getAllByIndex(indexName: string, query: IDBValidKey | IDBKeyRange) {
        return (await db).getAllFromIndex(this.store, indexName, query) as Promise<T[]>;
    }

    async delete(id: IDBValidKey) {
        return (await db).delete(this.store, id);
    }

    async clear() {
        return (await db).clear(this.store);
    }

    async count() {
        return (await db).count(this.store);
    }

    async getPagingByFilter(
        predicate: (item: T) => boolean,
        page: number,
        pageSize: number,
        indexName?: string,
        query?: IDBValidKey | IDBKeyRange
    ): Promise<PagingResult<T>> {
        const database = await db;
        const tx = database.transaction(this.store, "readonly");
        const objectStore = tx.objectStore(this.store);
        const source = indexName ? objectStore.index(indexName) : objectStore;

        const skip = (page - 1) * pageSize;
        const items: T[] = [];
        let matched = 0;

        let cursor = await source.openCursor(query);

        while (cursor) {
            if (predicate(cursor.value as T)) {
                if (matched >= skip && items.length < pageSize) {
                    items.push(cursor.value as T);
                }
                matched++;
            }
            cursor = await cursor.continue();
        }

        await tx.done;

        return {
            data: items,
            total: matched,
            page,
            pageSize,
            hasMore: skip + items.length < matched,
        };
    }


}