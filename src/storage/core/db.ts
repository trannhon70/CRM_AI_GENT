import { openDB } from "idb";
import { migrate } from "./migration";

export const db = openDB("crm-ai-agent", 1, {
    upgrade(database, oldVersion) {
        migrate(database, oldVersion);
    },
});