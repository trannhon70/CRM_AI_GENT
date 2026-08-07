import { openDB } from "idb";
import { migrate } from "./migration";

export const db = openDB("crm-ai-agent", 2, {
    upgrade(database, oldVersion) {
        migrate(database, oldVersion);
    },
});