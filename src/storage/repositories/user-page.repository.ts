import { Repository } from "../core/repository";
import { STORE } from "../core/stores";
import type { UserPageModel } from "../models";

export class UserPageRepository extends Repository<UserPageModel> {
    constructor() {
        super(STORE.USER_PAGE);
    }

    async getByUserId(userId: number) {
        return this.getAllByIndex("user_id", userId);
    }

    async getByProvider(provider: UserPageModel["provider"]) {
        return this.getAllByIndex("provider", provider);
    }

    async search(params: { search?: string; provider?: UserPageModel["provider"] }) {
        const { search, provider } = params;
        const all = await this.getAll();
        return all.filter((item) => {
            if (provider) {
                const kw = provider.toLowerCase();
                if (!item.provider?.toLowerCase().includes(kw)) return false;
            }
            if (search) {
                const kw = search.toLowerCase();
                if (!item.page.page_name?.toLowerCase().includes(kw)) return false;
            }
            return true;
        });
    }
}

export const userPageRepository = new UserPageRepository();