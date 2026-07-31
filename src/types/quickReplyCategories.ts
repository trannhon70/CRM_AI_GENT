export interface GetPagingQuickReplyCategoriesQuery {
    pageIndex?: number;
    limit?: number;
    search?: string;
    page_id: string;
}

export interface QuickReplyCategories {
    id: number;
    name: string;
    color: string;
    fanpage_id: number;
    created_at: number;
}