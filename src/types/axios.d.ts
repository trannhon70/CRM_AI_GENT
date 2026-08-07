// types/axios.d.ts
import "axios";

declare module "axios" {
    export interface AxiosError<T = unknown, D = any> {
        isOffline?: boolean;
    }
}