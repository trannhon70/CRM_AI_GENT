import type { IDBPDatabase } from "idb";
import { STORE } from "./stores";

export function migrate(db: IDBPDatabase<unknown>, oldVersion: number) {

    if (oldVersion < 1) {
        const pageStore = db.createObjectStore(STORE.USER_PAGE, { keyPath: "id" });
        pageStore.createIndex("user_id", "user_id");
        pageStore.createIndex("provider", "provider");
    }

    //Sau này version 2
    if (oldVersion < 2) {

    }
}